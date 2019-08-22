import {useLocalModel, hoistElemFactory} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionsPanelModel} from './PositionsPanelModel';
import {grid} from '@xh/hoist/cmp/grid';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {filler} from '@xh/hoist/cmp/layout';

export const positionsPanel = hoistElemFactory(() => {
    const model = useLocalModel(PositionsPanelModel),
        {gridModel, dimChooserModel, loadModel, loadTimestamp} = model;

    return panel({
        item: grid({model: gridModel}),
        bbar: [
            dimensionChooser({model: dimChooserModel}),
            filler(),
            relativeTimestamp({timestamp: loadTimestamp})
        ],
        mask: loadModel
    });
});