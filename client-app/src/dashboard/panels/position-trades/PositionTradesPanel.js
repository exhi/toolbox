import {useContext, useEffect} from 'react';
import {hoistElemFactory, useLocalModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionTradesModel} from './PositionTradesModel';
import {grid} from '@xh/hoist/cmp/grid';
import {OpenFinWindowContext} from '../../../openfin/window';

export const positionTradesPanel = hoistElemFactory(() => {
    const model = useLocalModel(PositionTradesModel),
        {gridModel, loadModel} = model;

    const openFinWindowModel = useContext(OpenFinWindowContext);
    if (openFinWindowModel) {
        useEffect(() => {
            model.openFinWindowModel = openFinWindowModel;
        }, [model, openFinWindowModel]);
    }

    return panel({
        item: grid({
            model: gridModel
        }),
        mask: loadModel
    });
});