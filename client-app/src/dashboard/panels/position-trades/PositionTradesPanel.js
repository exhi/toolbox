import {useEffect} from 'react';
import {hoistCmp, creates, useContextModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {PositionTradesModel} from './PositionTradesModel';
import {grid} from '@xh/hoist/cmp/grid';
import {switchInput} from '@xh/hoist/desktop/cmp/input';
import {filler} from '@xh/hoist/cmp/layout';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {OpenFinWindowModel} from '../../../openfin/window';

export const positionTradesPanel = hoistCmp.factory({
    model: creates(PositionTradesModel),
    render: ({model}) => {
        const {gridModel, loadModel, loadTimestamp} = model,
            openFinWindowModel = useContextModel(OpenFinWindowModel);

        if (openFinWindowModel) {
            useEffect(() => {
                model.openFinWindowModel = openFinWindowModel;
            }, [model, openFinWindowModel]);
        }

        return panel({
            item: grid({
                model: gridModel
            }),
            bbar: [
                switchInput({
                    model,
                    bind: 'isLinked',
                    label: 'Linked'
                }),
                filler(),
                relativeTimestamp({timestamp: loadTimestamp})
            ],
            mask: loadModel
        });
    }
});