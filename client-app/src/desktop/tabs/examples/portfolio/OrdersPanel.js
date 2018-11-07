/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {elemFactory, HoistComponent} from '@xh/hoist/core/index';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';
import {colChooserButton, grid} from '@xh/hoist/cmp/grid';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {storeCountLabel, storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {filler} from '@xh/hoist/cmp/layout';

@HoistComponent
export class OrdersPanel extends Component {

    render() {
        const {model, ...rest} = this.props,
            {gridModel} = model;

        return panel({
            title: 'Orders',
            icon: Icon.edit(),
            item: grid({model: gridModel}),
            mask: model.loadModel,
            bbar: toolbar(
                filler(),
                storeCountLabel({gridModel, unit: 'orders'}),
                storeFilterField({gridModel}),
                colChooserButton({gridModel})
            ),
            ...rest
        });
    }
}
export const ordersPanel = elemFactory(OrdersPanel);