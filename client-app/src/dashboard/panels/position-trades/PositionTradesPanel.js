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
        bbar: [
            // renderLinkStatus(model)
        ],
        mask: loadModel
    });
});

/** @param {PositionTradesModel} model */
/*
function renderLinkStatus(model) {
    const {isLinked} = model;
    let icon, text, intent;
    if (isLinked) {
        icon = Icon.link();
        text = 'Linked';
        intent = 'success';
    } else {
        icon = Icon.unlink();
        text = 'Unlinked';
        intent = null;
    }

    return fragment(
        button({
            icon,
            text,
            intent,
            onClick: () => model.setIsLinked(!isLinked)
        })
    );
}
*/