import {XH, HoistModel, managed, LoadSupport} from '@xh/hoist/core/index';
import {GridModel} from '@xh/hoist/cmp/grid/index';
import {wait} from '@xh/hoist/promise/index';
import {DimensionsEditorModel} from './DimensionsEditorModel';
import {Icon} from '@xh/hoist/icon/Icon';
import {Record} from '@xh/hoist/data';

@LoadSupport
@HoistModel
export class DimensionsModel {

    initialDimensions;

    DEFAULT_DIMENSIONS = [
        ['fund', 'trader'],
        ['sector', 'symbol'],
        ['model', 'trader', 'symbol']
    ];

    @managed
    editorModel = new DimensionsEditorModel({
        dimensions: [
            {value: 'fund', label: 'Fund'},
            {value: 'model', label: 'Model'},
            {value: 'region', label: 'Region'},
            {value: 'sector', label: 'Sector'},
            {value: 'symbol', label: 'Symbol'},
            {value: 'trader', label: 'Trader'}
        ],
        initialValue: ['fund']
    });

    @managed
    gridModel = new GridModel({
        groupBy: 'type',
        columns: [
            {field: 'id', headerName: null, width: 275, renderer: this.dimFormatter},
            {field: 'type', hidden: true}
        ]
    });

    async doLoadAsync() {
        const defaults = this.defaultRows,
            userDefined = [],
            allDims = [...defaults, ...userDefined];
        await wait(1)
            .then(() => {
                this.gridModel.loadData(allDims);
                this.gridModel.selModel.select({id: 'fund,trader'});
            });
    }

    constructor({initialDimensions}) {
        this.initialDimensions = initialDimensions;

        this.addReaction({
            track: () => this.editorModel.value,
            run: (val) => this.saveDimensions(val)
        });
    }

    openEditor(dims) {
        const value = dims ? dims.split(',') : null;
        this.editorModel.setPendingValue(value);
        this.editorModel.setIsOpen(true);
    }

    //----------------------
    // CONVENIENCE GETTERS
    //----------------------

    get selection() {
        const {selectedRecord: rec} = this.gridModel;
        return rec || null;
    }

    get dimensions() {return this.selection ? this.selection.id : null}

    get formattedDimensions() {return this.dimFormatter(this.dimensions)}

    get isSelectionProtected() {return this.selection ? this.selection.type === 'Default' : true}

    get defaultRows() {
        return this.DEFAULT_DIMENSIONS.map(it => {
            return {
                id: it.join(','),
                type: 'Default'
            };
        });
    }

    //---------------
    // Record Actions
    //---------------

    saveDimensions(val) {
        const {gridModel} = this,
            {store} = gridModel;

        const id = val.join(','),
            rec = new Record({
                raw: {id, type: 'Custom'},
                store
            });


        if (this.editorModel.isAdd) {
            store.addRecordInternal(rec)s
        } else {
            store.updateRecordInternal(this.selection, rec);
        }
    }

    async deleteDimensions(rec) {
        const {gridModel} = this,
            {store} = gridModel,
            {id, type} = rec;

        if (!store.getById(id) || type == 'Default') {
            XH.toast({
                message: 'Unable to delete grouping',
                intent: 'danger',
                icon: Icon.warning()
            });
            return;
        }
        store.deleteRecordInternal(rec);
        this.loadAsync()
            .then(() => gridModel.selectFirst());
    }

    //----------
    // Util
    //----------

    dimFormatter(v) {
        return v
            .split(',')
            .join(' \u203a ');
    }

}