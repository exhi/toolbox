/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */

import {XH, HoistModel} from '@xh/hoist/core';
import {GridModel} from '@xh/hoist/mobile/cmp/grid';
import {PendingTaskModel} from '@xh/hoist/utils/async';
import {LocalStore} from '@xh/hoist/data';
import {numberRenderer} from '@xh/hoist/format';

import {companyTrades} from '../../core/data';

@HoistModel
export class GridPageModel {

    loadModel = new PendingTaskModel();

    gridModel = new GridModel({
        store: new LocalStore({
            fields: ['company', 'profit_loss']
        }),
        leftColumn: {
            headerName: 'Company',
            field: 'company'
        },
        rightColumn: {
            headerName: 'P&L',
            field: 'profit_loss',
            valueFormatter: numberRenderer({
                precision: 0,
                ledger: true,
                colorSpec: true,
                asElement: true
            })
        }
    });

    constructor() {
        this.gridModel.loadData(companyTrades);
    }

    destroy() {
        XH.safeDestroy(this.gridModel);
        XH.safeDestroy(this.loadModel);
    }

}