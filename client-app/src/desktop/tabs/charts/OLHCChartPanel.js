import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {box, filler, vframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {select, numberInput} from '@xh/hoist/desktop/cmp/input';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {button} from '@xh/hoist/desktop/cmp/button/index';
import {controlGroup} from '@xh/hoist/kit/blueprint';
import {OLHCChartModel} from './OLHCChartModel';
import {wrapper} from '../../common/Wrapper';

@HoistComponent
export class OLHCChartPanel extends Component {
    model = new OLHCChartModel();

    render() {
        const {model} = this,
            {companyMap} = model;
        return wrapper({
            style: {paddingTop: 0},
            item: panel({
                className: 'toolbox-olhcchart-panel',
                title: 'Charts › OHLC',
                icon: Icon.chartLine(),
                width: 800,
                height: 600,
                item: this.renderExample(),
                tbar: toolbar(
                    box('Company: '),
                    select({
                        model,
                        bind: 'currentCompany',
                        options: Object.keys(companyMap),
                        enableFilter: false
                    }),
                    filler(),
                    box('Aspect Ratio: '),
                    controlGroup({
                        items: [
                            numberInput({
                                width: 50,
                                model,
                                bind: 'aspectRatio',
                                min: 0
                            }),
                            button({
                                icon: Icon.x(),
                                onClick: () => model.setAspectRatio(null)
                            })
                        ]
                    })
                )
            })
        });
    }

    renderExample() {
        const {chartModel, aspectRatio} = this.model;
        return vframe({
            className: 'toolbox-example-container',
            item: chart({
                model: chartModel, 
                aspectRatio: aspectRatio
            })
        });
    }
}