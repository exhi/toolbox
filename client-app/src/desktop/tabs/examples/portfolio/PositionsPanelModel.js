import {HoistModel, XH, managed, LoadSupport} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
// import {DimensionChooserModel} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {numberRenderer, millionsRenderer, fmtNumberTooltip} from '@xh/hoist/format';
import {GridModel} from '@xh/hoist/cmp/grid';
import {DimensionsModel} from "./dimensions/DimensionsModel";

@HoistModel
@LoadSupport
export class PositionsPanelModel {

    @bindable loadTimestamp;

    // @managed
    // dimChooserModel = new DimensionChooserModel({
    //     dimensions: [
    //         {value: 'fund', label: 'Fund'},
    //         {value: 'model', label: 'Model'},
    //         {value: 'region', label: 'Region'},
    //         {value: 'sector', label: 'Sector'},
    //         {value: 'symbol', label: 'Symbol'},
    //         {value: 'trader', label: 'Trader'}
    //     ],
    //     historyPreference: 'portfolioDimHistory'
    // });

    @managed
    dimensionsModel = new DimensionsModel();

    @managed
    gridModel = new GridModel({
        treeMode: true,
        sortBy: 'pnl|desc|abs',
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        rowBorders: true,
        showHover: true,
        compact: XH.appModel.useCompactGrids,
        stateModel: 'portfolio-positions-grid',
        columns: [
            {
                field: 'id',
                headerName: 'ID',
                width: 40,
                hidden: true
            },
            {
                field: 'name',
                headerName: 'Name',
                flex: 1,
                minWidth: 180,
                isTreeColumn: true
            },
            {
                field: 'mktVal',
                headerName: 'Mkt Value (m)',
                headerTooltip: 'Market value (in millions USD)',
                align: 'right',
                width: 130,
                absSort: true,
                agOptions: {
                    aggFunc: 'sum'
                },
                tooltip: (val) => fmtNumberTooltip(val, {ledger: true}),
                renderer: millionsRenderer({
                    precision: 3,
                    ledger: true
                })
            },
            {
                field: 'pnl',
                headerName: 'P&L',
                align: 'right',
                width: 130,
                absSort: true,
                agOptions: {
                    aggFunc: 'sum'
                },
                tooltip: (val) => fmtNumberTooltip(val, {ledger: true}),
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true,
                    colorSpec: true
                })
            }
        ]
    });

    get selectedRecord() {
        return this.gridModel.selectedRecord;
    }

    constructor() {
        this.addReaction({
            track: () => this.dimensionsModel.dimensions,
            run: this.loadAsync
        });
    }

    async doLoadAsync(loadSpec) {
        const {gridModel, dimensionsModel} = this;

        if (!dimensionsModel.dimensions) {
            await dimensionsModel.loadAsync();
        }
        const dims = dimensionsModel.dimensions;

        return XH.portfolioService
            .getPortfolioAsync(dims.split(','))
            .then(portfolio => {
                gridModel.loadData(portfolio);
                if (!gridModel.selectedRecord) {
                    gridModel.selectFirst();
                }
                this.setLoadTimestamp(Date.now());
            })
            .track({
                category: 'Portfolio Viewer',
                message: 'Loaded positions',
                data: {dims},
                loadSpec
            });
    }
}