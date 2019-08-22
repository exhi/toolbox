import {GridModel, timeCol} from '@xh/hoist/cmp/grid';
import {numberRenderer} from '@xh/hoist/format';

export function createTradesGridModel({groupBy = 'fund', hiddenCols = []}) {

    return new GridModel({
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
        groupBy,
        columns: [
            {
                field: 'id',
                headerName: 'ID',
                width: 40,
                hidden: true
            },
            {
                field: 'trader',
                hidden: hiddenCols.includes('trader')
            },
            {
                field: 'sector',
                hidden: hiddenCols.includes('sector')
            },
            {
                field: 'fund',
                hidden: hiddenCols.includes('fund')
            },
            {
                field: 'model',
                hidden: hiddenCols.includes('model')
            },
            {
                field: 'region',
                hidden: hiddenCols.includes('region')
            },
            {
                field: 'symbol',
                hidden: hiddenCols.includes('symbol')
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
}