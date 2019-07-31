import {XH, HoistModel, managed} from '@xh/hoist/core';
import {LoadSupport} from '@xh/hoist/core/mixins';
import {GridModel, emptyFlexCol} from '@xh/hoist/cmp/grid';
import {DimensionChooserModel} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {SplitTreeMapModel} from '@xh/hoist/desktop/cmp/treemap';
import {hspacer} from '@xh/hoist/cmp/layout';
import {numberRenderer, millionsRenderer, fmtMillions, fmtNumberTooltip} from '@xh/hoist/format';

@HoistModel
@LoadSupport
export class SplitTreeMapPanelModel {

    @managed
    dimChooserModel = new DimensionChooserModel({
        dimensions: [
            {value: 'region', label: 'Region'},
            {value: 'sector', label: 'Sector'},
            {value: 'symbol', label: 'Symbol'}
        ],
        initialValue: ['sector', 'symbol']
    });

    @managed
    gridModel = new GridModel({
        treeMode: true,
        sortBy: 'pnl|desc|abs',
        emptyText: 'No records found...',
        enableColChooser: true,
        compact: XH.appModel.useCompactGrids,
        selModel: 'multiple',
        columns: [
            {
                headerName: 'Name',
                width: 200,
                field: 'name',
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
                headerName: 'P&L',
                field: 'pnl',
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
            },
            {...emptyFlexCol}
        ]
    });

    @managed
    splitTreeMapModel = new SplitTreeMapModel({
        gridModel: this.gridModel,
        mapFilter: rec => rec.pnl >= 0,
        mapTitleFn: (mapName, model) => {
            const isPrimary = mapName === 'primary',
                v = isPrimary ? model.primaryMapTotal : model.secondaryMapTotal;
            return [
                isPrimary ? 'Profit:' : 'Loss:',
                hspacer(5),
                fmtMillions(v, {
                    prefix: '$',
                    precision: 2,
                    label: true,
                    asElement: true
                })
            ];
        },
        labelField: 'name',
        valueField: 'pnl',
        heatField: 'pnl',
        valueFieldLabel: 'Pnl'
    });

    constructor() {
        // Load data when dimensions change
        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: () => this.loadAsync()
        });
    }

    async doLoadAsync() {
        const dims = this.dimChooserModel.value;
        const data = await XH.portfolioService.getPortfolioAsync(dims);
        this.gridModel.loadData(data);
    }

}