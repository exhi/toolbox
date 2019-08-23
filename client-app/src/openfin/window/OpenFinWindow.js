import {useProvidedModel, hoistElemFactory, useLocalModel} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon/Icon';
import {getClassName} from '@xh/hoist/utils/react';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {vframe, hbox, filler, box} from '@xh/hoist/cmp/layout';
import {showDevTools, closeWindow} from '@xh/hoist/openfin/utils';

import {WindowState, OpenFinWindowModel} from './OpenFinWindowModel';
import './OpenFinWindow.scss';

export const openFinWindow = hoistElemFactory(props => {
    const model = useLocalModel(OpenFinWindowModel);
    return vframe({
        className: getClassName('openfin-window', props),
        items: [
            titleBar({model}),
            props.children
        ]
    });
});

const titleBar = hoistElemFactory(props => {
    const model = useProvidedModel(OpenFinWindowModel, props),
        {isDocked, windowState} = model;

    if (model.isInTabGroup) return null;

    console.debug('Window State:', windowState);

    return hbox({
        className: 'title-bar',
        items: [
            box({
                className: 'title-bar--title',
                item: 'some name'
            }),
            filler(),
            buttonGroup({
                className: 'title-bar--buttons',
                items: [
                    button({
                        icon: Icon.code(),
                        onClick: () => showDevTools()
                    }),
                    button({
                        omit: !isDocked,
                        icon: Icon.unlink(),
                        intent: 'primary',
                        onClick: () => model.undockAsync()
                    }),
                    button({
                        icon: Icon.minimize(),
                        onClick: () => model.minimizeAsync()
                    }),
                    button({
                        omit: windowState === WindowState.MAXIMIZED,
                        icon: Icon.expand(),
                        onClick: () => model.maximizeAsync()
                    }),
                    button({
                        omit: windowState !== WindowState.MAXIMIZED,
                        icon: Icon.collapse(),
                        onClick: () => model.restoreAsync()
                    }),
                    button({
                        icon: Icon.close(),
                        intent: 'danger',
                        onClick: () => closeWindow()
                    })
                ]
            })
        ]
    });
});