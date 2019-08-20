import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {elemFactory} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {splitTreeMap} from '@xh/hoist/desktop/cmp/treemap';

@HoistComponent
export class MapPanel extends Component {

    render() {
        const {model} = this,
            {splitTreeMapModel, panelSizingModel, loadModel} = model,
            {inWindow} = this.props;

        return panel({
            title: !inWindow && panelSizingModel.collapsed ? 'Treemap' : null,
            mask: loadModel,
            model: inWindow ? null : panelSizingModel,
            item: splitTreeMap({
                model: splitTreeMapModel
            })
        });
    }
}

export const mapPanel = elemFactory(MapPanel);

