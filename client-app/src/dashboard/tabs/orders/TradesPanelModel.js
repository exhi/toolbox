import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {timeCol, GridModel} from '@xh/hoist/cmp/grid';
import {numberRenderer} from '@xh/hoist/format';

@HoistModel
@LoadSupport
export class TradesPanelModel {

    gridModel = new GridModel({
        store: {
            fields: [
                'symbol',
                'sector',
                'region',
                'dir',
                'quantity',
                'price',
                'mktVal',
                {
                    name: 'time',
                    type: 'date'
                },
                'commission',
                'confidence',
                'model',
                'trader',
                'fund'
            ]
        },
        colDefaults: {
            width: 120
        },
        groupBy: 'fund',
        columns: [
            {
                field: 'id',
                headerName: 'ID',
                width: 40,
                hidden: true
            },
            {
                field: 'trader'
            },
            {
                field: 'sector'
            },
            {
                field: 'fund'
            },
            {
                field: 'model'
            },
            {
                field: 'region'
            },
            {
                field: 'symbol'
            },
            {
                field: 'dir',
                headerName: 'B/S',
                align: 'center'
            },
            {
                field: 'quantity',
                headerName: 'Qty',
                align: 'right',
                absSort: true,
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true
                })
            },
            {
                field: 'price',
                align: 'right',
                renderer: numberRenderer({
                    precision: 4
                })
            },
            {
                field: 'commission',
                align: 'right',
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true
                })
            },
            {
                field: 'confidence',
                headerName: 'Confidence',
                align: 'right',
                renderer: (v, {record, agParams}) => {
                    // Only want to show values for group rows/totals
                    if (record) return null;

                    // TODO: Calculate min/max for all leaf nodes under this for display
                    console.debug('Calculate Min/Max Confidence for', agParams);
                    return 'TODO';
                }
            },
            {
                field: 'time',
                ...timeCol
            }
        ]
    });

    async doLoadAsync() {
        const orders = await XH.portfolioService.getAllOrdersAsync();
        this.gridModel.loadData(orders);
    }
}