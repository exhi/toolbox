import {GridModel} from '@xh/hoist/cmp/grid';
import {div, hbox} from '@xh/hoist/cmp/layout';
import {HoistModel, managed, persist, XH} from '@xh/hoist/core';
import {action, bindable, makeObservable, observable, runInAction} from '@xh/hoist/mobx';
import {isEmpty, uniq, without} from 'lodash';
import {PERSIST_APP} from './AppModel';
import {favoriteButton} from './cmp/FavoriteButton';
import {DetailsPanelModel} from './details/DetailsPanelModel';

/**
 * Primary model to load a list of contacts from the server and manage filter and selection state.
 * Support showing results in a grid or tiled set of photos.
 */
export class DirectoryPanelModel extends HoistModel {

    persistWith = PERSIST_APP;

    /** @member {string[]} - known tags across all contacts. */
    @observable.ref tagList = [];

    /** @member {string[]} - known locations across all contacts. */
    @observable.ref locationList = [];

    /** @member {function} - filter generated by StoreFilterField, if any. */
    @bindable quickFilter;

    /** @member {string} */
    @bindable locationFilter;

    /**  @member {string[]} - tag(s) used to filter results. If multiple, recs must match all. */
    @bindable.ref tagFilters = [];

    /** @member {('grid'|'tiles')} */
    @bindable @persist displayMode = 'grid';

    /** @member {DetailsPanelModel} */
    @managed detailsPanelModel;

    /** @member {GridModel} */
    @managed gridModel;

    get selectedRecord() {
        return this.gridModel.selectedRecord;
    }

    get records() {
        return this.gridModel.store.records;
    }

    constructor() {
        super();
        makeObservable(this);

        const gridModel = this.gridModel = this.createGridModel();
        this.detailsPanelModel = new DetailsPanelModel(this);

        this.addReaction({
            track: () => gridModel.selectedRecord,
            run: (rec) => this.detailsPanelModel.setCurrentRecord(rec)
        });

        this.addReaction({
            track: () => [this.quickFilter, this.locationFilter, this.tagFilters],
            run: () => this.updateFilter(),
            fireImmediately: true
        });
    }

    async updateContactAsync(id, data) {
        await XH.contactService.updateContactAsync(id, data);
        await this.loadAsync();
    }

    toggleFavorite(record) {
        XH.contactService.toggleFavorite(record.id);
        // Update store directly, to avoid more heavyweight full reload.
        this.gridModel.store.modifyRecords({id: record.id, isFavorite: !record.data.isFavorite});
    }

    //------------------------
    // Implementation
    //------------------------
    async doLoadAsync(loadSpec) {
        const {gridModel} = this;

        try {
            const contacts = await XH.contactService.getContactsAsync();
            runInAction(() => {
                this.tagList = uniq(contacts.flatMap(it => it.tags ?? [])).sort();
                this.locationList = uniq(contacts.map(it => it.location)).sort();
            });

            gridModel.loadData(contacts);
            gridModel.preSelectFirstAsync();
        } catch (e) {
            XH.handleException(e);
        }
    }

    updateFilter() {
        const {quickFilter, locationFilter, tagFilters, gridModel} = this;

        gridModel.setFilter([
            quickFilter,
            locationFilter ? {field: 'location', op: '=', value: locationFilter} : null,
            !isEmpty(tagFilters) ?
                {testFn: (rec) => tagFilters.every(tag => rec.data.tags?.includes(tag))} :
                null
        ]);
    }

    createGridModel() {
        return new GridModel({
            store: {
                fields: ['profilePicture', 'bio']
            },
            emptyText: 'No matching contacts found.',
            colChooserModel: true,
            enableExport: true,
            rowBorders: true,
            showHover: true,
            colDefaults: {width: 160},
            persistWith: this.persistWith,
            groupBy: 'isFavorite',
            groupRowRenderer: ({value}) => value === 'true' ? 'Favorites' : 'XH Engineers',
            groupSortFn: (a, b) => (a < b ? 1 : -1),
            columns: [
                {
                    field: 'isFavorite',
                    headerName: null,
                    align: 'center',
                    resizable: false,
                    width: 40,
                    elementRenderer: this.isFavoriteRenderer,
                    excludeFromExport: true
                },
                {field: 'name', width: 200},
                {field: 'location'},
                {field: 'email'},
                {field: 'cellPhone', hidden: true},
                {field: 'workPhone', hidden: true},
                {
                    field: 'tags',
                    width: 400,
                    elementRenderer: this.tagsRenderer
                }
            ]
        });
    }

    @action
    toggleTag(tag) {
        const tagFilters = this.tagFilters ?? [];
        this.tagFilters = tagFilters.includes(tag) ? without(tagFilters, tag) : [...tagFilters, tag];
    }

    isFavoriteRenderer = (v, {record}) => {
        return favoriteButton({model: this, record});
    };

    tagsRenderer = (v) => {
        if (isEmpty(v)) return null;

        return hbox({
            className: 'tb-contact-tag-container',
            items: v.map(tag => (
                div({
                    className: 'tb-contact-tag',
                    item: tag,
                    onClick: () => this.toggleTag(tag)
                }))
            )
        });
    };
}
