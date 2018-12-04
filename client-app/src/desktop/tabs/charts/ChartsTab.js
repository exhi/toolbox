import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {tabContainer, TabContainerModel} from '@xh/hoist/desktop/cmp/tab';

import {OLHCChartPanel} from './OLHCChartPanel';
import {LineChartPanel} from './LineChartPanel';

@HoistComponent
export class ChartsTab extends Component {

    localModel = new TabContainerModel({
        route: 'default.charts',
        tabs: [
            {id: 'olhc', title: 'OLHC', content: OLHCChartPanel},
            {id: 'line', content: LineChartPanel}
        ]
    });
    
    async loadAsync() {
        this.model.requestRefresh();
    }

    render() {
        return tabContainer({
            model: this.model,
            switcherPosition: 'left',
            className: 'toolbox-tab'
        });
    }
}
