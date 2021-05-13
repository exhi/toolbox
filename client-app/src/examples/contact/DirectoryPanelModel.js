import {GridModel} from '@xh/hoist/cmp/grid';
import {HoistModel, managed, persist, XH} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon/Icon';
import {bindable, observable, makeObservable, action} from '@xh/hoist/mobx';
import {without} from 'lodash';
import {PERSIST_APP} from './AppModel';
import {DetailsPanelModel} from './detail/DetailsPanelModel';
import {button} from '@xh/hoist/desktop/cmp/button';

export class DirectoryPanelModel extends HoistModel {

    persistWith = PERSIST_APP;

    @observable.ref
    @persist
    userFaves = [];

    /** @member {function} */
    @bindable
    searchQuery;

    /** @member {string} */
    @bindable
    locationFilter;

    @bindable
    displayMode = 'grid';

    @managed
    detailsPanelModel;

    /** @member {GridModel} */
    @managed
    gridModel;

    get currentRecord() {
        return this.gridModel.selectedRecord;
    }

    constructor() {
        super();
        makeObservable(this);

        const gridModel = this.gridModel = this.createGridModel();
        this.detailsPanelModel = new DetailsPanelModel();

        this.addReaction({
            track: () => gridModel.selectedRecord,
            run: (rec) => this.detailsPanelModel.setCurrentRecord(rec)
        });

        this.addReaction({
            track: () => [this.locationFilter, this.searchQuery],
            run: () => gridModel.setFilter(this.createFilter()),
            fireImmediately: true
        });
    }


    //------------------------
    // Implementation
    //------------------------
    async doLoadAsync(loadSpec) {
        const {gridModel} = this;
        let entries = [];

        try {
            let contacts = await XH.fetchJson({
                url: 'contacts'
            });

            contacts.forEach(contactInfo => {
                entries.push({...contactInfo, isFavorite: this.userFaves.includes(contactInfo.id)});
            });

            gridModel.loadData(entries);
            await gridModel.preSelectFirstAsync();
        } catch (e) {
            XH.handleException(e);
        }
    }

    createFilter() {
        const {searchQuery, locationFilter} = this;
        return [
            searchQuery,
            locationFilter ? {field: 'location', op: '=', value: locationFilter} : null
        ];
    }

    createGridModel() {
        return new GridModel({
            store: {
                fields: ['profilePicture', 'bio']
            },
            emptyText: 'No records found...',
            colChooserModel: true,
            enableExport: true,
            rowBorders: true,
            showHover: true,
            persistWith: this.persistWith,
            columns: [
                {
                    field: 'isFavorite',
                    displayName: 'Favorites',
                    align: 'center',
                    width: 70,
                    elementRenderer: (val, {record}) => {
                        const {isFavorite} = record.data;

                        return button({
                            icon: Icon.favorite({
                                color: isFavorite ? 'gold' : null,
                                prefix: isFavorite ? 'fas' : 'far'
                            }),
                            onClick: () => this.toggleFavorite(record)
                        });
                    }
                },
                {
                    field: 'name'
                },
                {
                    field: 'location'
                },
                {
                    field: 'workPhone'
                },
                {
                    field: 'homePhone',
                    hidden: true
                },
                {
                    field: 'cellPhone',
                    hidden: true
                },
                {
                    field: 'email'
                }
            ]
        });
    }

    @action
    toggleFavorite(record) {
        const {userFaves} = this;
        this.userFaves = record.data.isFavorite ? without(userFaves, record.id) : [...userFaves, record.id];
        this.refreshAsync();
    }

}
