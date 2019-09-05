import {XH} from '@xh/hoist/core';
import {GridModel, timeCol} from '@xh/hoist/cmp/grid';
import {numberRenderer} from '@xh/hoist/format';
import {StoreContextMenu} from '@xh/hoist/desktop/cmp/contextmenu';
import {Icon, convertIconToSvg} from '@xh/hoist/icon/Icon';
import {isRunningInOpenFin, createWindowAsync} from '@xh/hoist/openfin/utils';

export function createTradesGridModel({groupBy = 'fund', hiddenCols = []} = {}) {
    return new GridModel({
        compact: true,
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
                hidden: hiddenCols.includes('trader'),
                width: 108
            },
            {
                field: 'sector',
                hidden: hiddenCols.includes('sector'),
                width: 134
            },
            {
                field: 'fund',
                hidden: hiddenCols.includes('fund'),
                width: 107
            },
            {
                field: 'model',
                hidden: hiddenCols.includes('model'),
                width: 70
            },
            {
                field: 'region',
                hidden: hiddenCols.includes('region'),
                width: 127
            },
            {
                field: 'symbol',
                hidden: hiddenCols.includes('symbol'),
                width: 72
            },
            {
                field: 'dir',
                headerName: 'B/S',
                align: 'center',
                width: 100
            },
            {
                field: 'quantity',
                headerName: 'Qty',
                align: 'right',
                absSort: true,
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true
                }),
                width: 66
            },
            {
                field: 'price',
                align: 'right',
                renderer: numberRenderer({
                    precision: 4
                }),
                width: 76
            },
            {
                field: 'commission',
                align: 'right',
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true
                }),
                width: 97
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
                },
                width: 92
            },
            {
                field: 'time',
                ...timeCol
            }
        ],
        contextMenuFn: (agParams, gridModel) => new StoreContextMenu({
            items: [
                {
                    icon: Icon.openExternal(),
                    text: 'Trading Volume',
                    recordsRequired: 1,
                    displayFn: ({record}) => {
                        if (!isRunningInOpenFin()) return {hidden: true};

                        return {text: `Trading Volume | ${record.symbol}`};
                    },
                    actionFn: ({record}) => {
                        const {symbol} = record;
                        createWindowAsync(`trading-volume-${symbol}-${XH.genId()}`, {
                            url: XH.router.buildUrl('default.tradingVolume', {symbol}),
                            frame: false,
                            defaultCentered: true,
                            saveWindowState: false,
                            customData: JSON.stringify({
                                title: `Trading Volume | ${symbol}`,
                                icon: convertIconToSvg(Icon.chartLine())
                            })
                        });
                    }
                },
                '-',
                ...GridModel.defaultContextMenuTokens
            ],
            gridModel
        })
    });
}