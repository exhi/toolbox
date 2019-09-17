import {useEffect} from 'react';
import {hoistCmp, creates, useContextModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionsModel} from './PositionsModel';
import {grid} from '@xh/hoist/cmp/grid';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {filler} from '@xh/hoist/cmp/layout';
import {toolbarSeparator} from '@xh/hoist/desktop/cmp/toolbar';

import './PositionsPanel.scss';
import {OpenFinWindowModel} from '../../../openfin/window';

export const positionsPanel = hoistCmp.factory({
    model: creates(PositionsModel),
    className: 'positions-panel',
    render: ({model, className}) => {
        const {gridModel, dimChooserModel, loadModel, loadTimestamp} = model,
            openFinWindowModel = useContextModel(OpenFinWindowModel);

        useEffect(() => {
            model.initAsync({openFinWindowModel});
        }, [model, openFinWindowModel]);

        return panel({
            className,
            item: grid({model: gridModel}),
            bbar: [
                dimensionChooser({model: dimChooserModel}),
                toolbarSeparator(),
                filler(),
                relativeTimestamp({timestamp: loadTimestamp})
            ],
            mask: loadModel
        });
    }
});