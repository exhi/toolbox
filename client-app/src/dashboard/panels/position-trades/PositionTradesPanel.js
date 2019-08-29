import {hoistElemFactory, useLocalModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionTradesModel} from './PositionTradesModel';
import {grid} from '@xh/hoist/cmp/grid';

export const positionTradesPanel = hoistElemFactory(() => {
    const model = useLocalModel(PositionTradesModel),
        {gridModel, loadModel} = model;

    return panel({
        item: grid({
            model: gridModel
        }),
        mask: loadModel
    });
});