import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {wrapper} from '../../common/Wrapper';
import {span, vframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {select} from '@xh/hoist/desktop/cmp/input';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {LineChartModel} from './LineChartModel';

@HoistComponent
export class LineChartPanel extends Component {
    model = new LineChartModel();

    render() {
        const {model} = this,
            {companyMap} = model;
        return wrapper(
            panel({
                className: 'toolbox-linechart-panel',
                title: 'Charts › Line',
                width: 800,
                height: 600,
                item: this.renderExample(),
                tbar: toolbar(
                    span('Company: '),
                    select({
                        model,
                        bind: 'currentCompany',
                        options: Object.keys(companyMap),
                        enableFilter: false
                    })
                )
            })
        );
    }

    renderExample() {
        return vframe({
            className: 'toolbox-example-container',
            item: chart({model: this.model.chartModel})
        });
    }
}