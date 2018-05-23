/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {wrapperPanel} from '../impl/WrapperPanel';
import {vframe, panel} from '@xh/hoist/cmp/layout';
import {comboField, label} from '@xh/hoist/cmp/form';
import {toolbar} from '@xh/hoist/cmp/toolbar';
import {chart} from '@xh/hoist/cmp/chart';
import {loadMask} from '@xh/hoist/cmp/mask';
import {CandleChartModel} from './CandleChartModel';

@HoistComponent()
export class CandleChartPanel extends Component {
    localModel = new CandleChartModel();

    render() {
        const model = this.model,
            {companyMap} = model;
        return wrapperPanel(
            panel({
                cls: 'xh-toolbox-candlechart-panel',
                title: 'Candle Chart',
                width: 600,
                height: 400,
                item: this.renderExample(),
                tbar: toolbar(
                    label('Company: '),
                    comboField({
                        model,
                        options: Object.keys(companyMap),
                        field: 'currentCompany'
                    }),
                )
            })
        );
    }

    renderExample() {
        const model = this.model,
            {chartModel} = model;

        return vframe({
            cls: 'xh-toolbox-example-container',
            items: [
                chart({model: chartModel}),
                loadMask({isOpen: false})
            ]
        });
    }
}