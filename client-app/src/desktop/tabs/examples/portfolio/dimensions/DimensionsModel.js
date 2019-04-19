import {XH, HoistModel, managed, LoadSupport} from '@xh/hoist/core/index';
import {GridModel} from '@xh/hoist/cmp/grid/index';
import {wait} from '@xh/hoist/promise/index';
import {DimensionsEditorModel} from './DimensionsEditorModel';
import {Icon} from '@xh/hoist/icon/Icon';
import {unionWith, pullAllWith, isEqual, startCase} from 'lodash';

@LoadSupport
@HoistModel
export class DimensionsModel {

    DEFAULT_DIMENSIONS = [
        ['fund', 'trader'],
        ['sector', 'symbol'],
        ['model', 'trader', 'symbol']
    ];

    userDims = null;

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
        const {defaultRows, userRows, gridModel} = this;

        await wait(1)
            .then(() => {
                gridModel.loadData([...defaultRows, ...userRows]);
                gridModel.selModel.select({id: 'fund,trader'});
            });
    }

    constructor() {
        this.userDims = XH.getPref('portfolioSavedDims');
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


    //-----------------------
    // Process dims for grid
    //-----------------------

    get defaultRows() {
        return this.DEFAULT_DIMENSIONS.map(it => {
            return {
                id: it.join(','),
                type: 'Default'
            };
        });
    }

    get userRows() {
        return this.userDims.map(it => {
            return {
                id: it.join(','),
                type: 'Custom'
            }
        })

    }

    //---------------
    // Record Actions
    //---------------

    saveDimensions(value) {
        this.userDims = unionWith(this.userDims, [value], isEqual);
        XH.setPref('portfolioSavedDims', this.userDims);
        this.loadAsync();
    }

    async deleteDimensions(rec) {
        const {gridModel} = this,
            {store} = gridModel,
            {id, type} = rec,
            value = id.split(',');

        if (!store.getById(id) || type == 'Default') {
            XH.toast({
                message: 'Unable to delete grouping',
                intent: 'danger',
                icon: Icon.warning()
            });
            return;
        }
        pullAllWith(this.userDims, [value], isEqual);
        XH.setPref('portfolioSavedDims', this.userDims);
        this.loadAsync(this.userDims)
            .then(() => gridModel.selectFirst());
    }

    //----------
    // Util
    //----------

    dimFormatter(v) {
        return v
            .split(',')
            .map(v => startCase(v))
            .join(' \u203a ');
    }

}