import {XH, HoistModel, managed, LoadSupport} from '@xh/hoist/core/index';
import {GridModel} from '@xh/hoist/cmp/grid/index';
import {wait} from '@xh/hoist/promise/index';
import {DimensionsEditorModel} from './DimensionsEditorModel';
import {Icon} from '@xh/hoist/icon/Icon';
import {unionWith, pullAllWith, some, isEqual, startCase, cloneDeep} from 'lodash';

@LoadSupport
@HoistModel
export class DimensionsModel {

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

    async doLoadAsync(loadSpec) {
        const {defaultRows, userRows, gridModel} = this;

        await wait(1)
            .then(() => {
                gridModel.loadData([...defaultRows, ...userRows]);
                if (!gridModel.selectedRecord && !loadSpec.isAdd) gridModel.selectFirst();
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

    get defaultDimensions() {
        return XH.getConf('portfolioDefaultDims');
    }
    get selection() {
        const {selectedRecord: rec} = this.gridModel;
        return rec || null;
    }

    get selectedDimensions() {return this.selection ? this.selection.id : null}

    get formattedDimensions() {return this.dimFormatter(this.selectedDimensions)}

    get isSelectionProtected() {return this.selection ? this.selection.type === 'Default' : true}


    //-----------------------
    // Process dims for grid
    //-----------------------

    get defaultRows() {
        return this.defaultDimensions.map(it => {
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
            };
        });
    }

    //---------------
    // Record Actions
    //---------------

    saveDimensions(value) {
        const {isAdd} = this.editorModel,
            newId = value.join(',');

        if (some(this.defaultDimensions, d  => isEqual(d, value))) {
            XH.toast({
                message: `Not saved: '${this.dimFormatter(newId)}' is a default grouping.`,
                intent: 'warning',
                icon: Icon.warning()
            });
            return;
        }

        const dimsCopy = cloneDeep(this.userDims);
        if (!isAdd) {
            pullAllWith(dimsCopy, [this.selectedDimensions.split(',')], isEqual);
        }
        this.userDims = unionWith(dimsCopy, [value], isEqual);

        XH.setPref('portfolioSavedDims', this.userDims);
        this.loadAsync({isAdd: true})
            .then(() => this.gridModel.selModel.select(newId));
    }

    async deleteDimensions(rec) {
        const {gridModel, userDims} = this,
            {store} = gridModel,
            {id, type} = rec,
            value = id.split(',');

        if (!store.getById(id) || type == 'Default') {
            XH.toast({
                message: 'Unable to delete grouping',
                intent: 'danger',
                icon: Icon.error()
            });
            return;
        }

        const dimsCopy = cloneDeep(userDims);

        this.userDims = pullAllWith(dimsCopy, [value], isEqual);

        XH.setPref('portfolioSavedDims', this.userDims);
        this.loadAsync()
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