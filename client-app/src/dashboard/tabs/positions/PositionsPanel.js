import {hoistComponent, useLocalModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionsPanelModel} from './PositionsPanelModel';
import {grid} from '@xh/hoist/cmp/grid';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';

export const [, positionsPanel] = hoistComponent(() => {
    const model = useLocalModel(PositionsPanelModel),
        {gridModel, dimChooserModel, loadModel} = model;

    return panel({
        item: grid({model: gridModel}),
        bbar: [
            dimensionChooser({model: dimChooserModel})
        ],
        mask: loadModel
    });
});