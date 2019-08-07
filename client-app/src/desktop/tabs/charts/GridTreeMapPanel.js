import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {hframe} from '@xh/hoist/cmp/layout';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {grid} from '@xh/hoist/cmp/grid';
import {treeMap} from '@xh/hoist/desktop/cmp/treemap';

import {GridTreeMapModel} from './GridTreeMapModel';

@HoistComponent
export class GridTreeMapPanel extends Component {

    model = new GridTreeMapModel();

    render() {
        const {model} = this,
            {loadModel, dimChooserModel, gridModel, treeMapModel} = model;

        return panel({
            mask: loadModel,
            bbar: [dimensionChooser({model: dimChooserModel})],
            items: hframe(
                panel({
                    model: {defaultSize: 480, side: 'left'},
                    item: grid({model: gridModel})
                }),
                treeMap({model: treeMapModel})
            )
        });
    }

}