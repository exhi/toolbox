import {useLocalModel, hoistElemFactory} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionsModel} from './PositionsModel';
import {grid} from '@xh/hoist/cmp/grid';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {filler} from '@xh/hoist/cmp/layout';
import {getClassName} from '@xh/hoist/utils/react';

import './PositionsPanel.scss';

export const positionsPanel = hoistElemFactory(props => {
    const model = useLocalModel(PositionsModel),
        {gridModel, dimChooserModel, loadModel, loadTimestamp} = model;

    return panel({
        className: getClassName('positions-panel', props),
        item: grid({model: gridModel}),
        bbar: [
            dimensionChooser({model: dimChooserModel}),
            filler(),
            relativeTimestamp({timestamp: loadTimestamp})
        ],
        mask: loadModel
    });
});