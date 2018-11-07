import {HoistModel, XH} from '@xh/hoist/core';
import {GridModel} from '@xh/hoist/cmp/grid';
import {LocalStore} from '@xh/hoist/data';
import {emptyFlexCol, dateTimeCol} from '@xh/hoist/cmp/grid/columns';
import {PendingTaskModel} from '@xh/hoist/utils/async';
import {numberRenderer} from '@xh/hoist/format';
import {isNil} from 'lodash';

@HoistModel
export class OrdersPanelModel {

    loadModel = new PendingTaskModel();

    gridModel = new GridModel({
        store: new LocalStore({
            fields: [
                'id', 'symbol', 'trader', 'model', 'fund', 'region', 'sector',
                'dir', 'quantity', 'price', 'mktVal', 'time'
            ]
        }),
        groupBy: 'dir',
        sortBy: [{colId: 'time', sort: 'desc'}],
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        columns: [
            {
                field: 'symbol',
                headerName: 'Instrument',
                width: 100
            },
            {
                field: 'trader',
                headerName: 'Trader',
                width: 160
            },
            {
                field: 'fund',
                headerName: 'Fund',
                width: 160,
                hidden: true
            },
            {
                field: 'model',
                headerName: 'Model',
                width: 160,
                hidden: true
            },
            {
                field: 'region',
                headerName: 'Region',
                width: 160,
                hidden: true
            },
            {
                field: 'sector',
                headerName: 'Sector',
                width: 160,
                hidden: true
            },
            {
                field: 'dir',
                headerName: 'Direction',
                width: 100
            },
            {
                field: 'quantity',
                headerName: 'Quantity',
                width: 100,
                align: 'right',
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true,
                    tooltip: true
                })
            },
            {
                field: 'price',
                headerName: 'Price',
                width: 100,
                align: 'right',
                renderer: numberRenderer({
                    precision: 2
                })
            },
            {
                field: 'time',
                headerName: 'Exec Time',
                ...dateTimeCol,
                align: 'left'
            },
            {...emptyFlexCol}
        ]
    });

    get selectedRecord() {
        return this.gridModel.selectedRecord;
    }

    async loadOrdersForPositionAsync(posId) {
        if (isNil(posId)) {
            this.gridModel.loadData([]);
            return;
        }

        return XH.portfolioService.getOrdersAsync(posId)
            .then(orders => {
                console.log('loading orders', orders.length);
                this.gridModel.loadData(orders);
                if (orders.length > 0) {
                    this.gridModel.selectFirst();
                }
            })
            .linkTo(this.loadModel);
    }
}