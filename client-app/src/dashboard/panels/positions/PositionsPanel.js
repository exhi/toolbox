import {useContext, useEffect} from 'react';
import {useLocalModel, hoistElemFactory} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionsModel} from './PositionsModel';
import {grid} from '@xh/hoist/cmp/grid';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {filler} from '@xh/hoist/cmp/layout';
import {getClassName} from '@xh/hoist/utils/react';
import {OpenFinWindowContext} from '../../../openfin/window';

import './PositionsPanel.scss';
import {toolbarSeparator} from '@xh/hoist/desktop/cmp/toolbar';
import {button} from '@xh/hoist/desktop/cmp/button';

export const positionsPanel = hoistElemFactory(props => {
    const model = useLocalModel(PositionsModel),
        {gridModel, dimChooserModel, loadModel, loadTimestamp} = model,
        openFinWindowModel = useContext(OpenFinWindowContext);

    useEffect(() => {
        model.initAsync({openFinWindowModel});
    });

    return panel({
        className: getClassName('positions-panel', props),
        item: grid({model: gridModel}),
        bbar: [
            dimensionChooser({model: dimChooserModel}),
            toolbarSeparator(),
            button({

            }),
            filler(),
            relativeTimestamp({timestamp: loadTimestamp})
        ],
        mask: loadModel
    });
});