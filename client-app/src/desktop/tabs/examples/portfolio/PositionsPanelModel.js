import {HoistModel, XH} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {wait} from '@xh/hoist/promise';
import {PanelSizingModel} from '@xh/hoist/desktop/cmp/panel';
import {DimensionChooserModel} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {numberRenderer, millionsRenderer} from '@xh/hoist/format';
import {GridModel} from '@xh/hoist/cmp/grid';
import {LocalStore} from '@xh/hoist/data';
import {PendingTaskModel} from '@xh/hoist/utils/async';

@HoistModel
export class PositionsPanelModel {

    @bindable loadTimestamp;

    dimChooserModel = new DimensionChooserModel({
        dimensions: [
            {value: 'model', label: 'Model'},
            {value: 'symbol', label: 'Symbol'},
            {value: 'sector', label: 'Sector'},
            {value: 'fund', label: 'Fund'},
            {value: 'region', label: 'Region'}
        ],
        historyPreference: 'portfolioDimHistory'
    });

    gridModel = new GridModel({
        treeMode: true,
        store: new LocalStore({
            fields: ['id', 'name', 'pnl', 'mktVal']
        }),
        sortBy: 'pnl|desc|abs',
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
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
                isTreeColumn: true
            },
            {
                field: 'mktVal',
                headerName: 'Mkt Value (m)',
                align: 'right',
                width: 130,
                absSort: true,
                agOptions: {
                    aggFunc: 'sum'
                },
                renderer: millionsRenderer({
                    precision: 3,
                    ledger: true,
                    tooltip: true
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
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true,
                    colorSpec: true,
                    tooltip: true
                })
            }
        ]
    });

    sizingModel = new PanelSizingModel({
        defaultSize: 500,
        side: 'left'
    });

    loadModel = new PendingTaskModel();

    get selectedRecord() {
        return this.gridModel.selectedRecord;
    }

    constructor() {
        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: (dimensions) => this.loadAsync(),
            fireImmediately: true
        });
    }

    loadAsync() {
        return XH.portfolioService
            .getPortfolioAsync(this.dimChooserModel.value)
            .then(portfolio => {
                this.gridModel.loadData(portfolio);
                wait(300).then(() => this.gridModel.selectFirst());  // TODO - this, working reliably.
                this.setLoadTimestamp(Date.now());
            })
            .linkTo(this.loadModel);
    }
}