import {Component} from 'react';
import {HoistComponent, LoadSupport} from '@xh/hoist/core';
import {wrapper} from '../../common/Wrapper';
import {box, filler, vframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {select, numberInput} from '@xh/hoist/desktop/cmp/input';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {OLHCChartModel} from './OLHCChartModel';
import {button} from '@xh/hoist/desktop/cmp/button/index';
import {Icon} from '@xh/hoist/icon/index';
import { controlGroup } from '@xh/hoist/kit/blueprint';

@HoistComponent
@LoadSupport
export class OLHCChartPanel extends Component {
    model = new OLHCChartModel();

    render() {
        const {model} = this,
            {companyMap} = model;
        return wrapper({
            style: {paddingTop: 0},
            item: panel({
                className: 'toolbox-olhcchart-panel',
                title: 'OLHC Chart',
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
                                commitOnChange: true,
                                min: 0
                            }),
                            button({
                                icon: Icon.cross(),
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