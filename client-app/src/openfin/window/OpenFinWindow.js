import React from 'react';
import {useProvidedModel, hoistElemFactory, useLocalModel, elemFactory} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon/Icon';
import {getClassName} from '@xh/hoist/utils/react';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {vframe, hbox, filler, box} from '@xh/hoist/cmp/layout';
import {showDevTools, closeWindow} from '@xh/hoist/openfin/utils';

import {WindowState, OpenFinWindowModel} from './OpenFinWindowModel';
import './OpenFinWindow.scss';

export const OpenFinWindowContext = React.createContext(null);
const openFinWindowContextProvider = elemFactory(OpenFinWindowContext.Provider);

export const openFinWindow = hoistElemFactory(props => {
    const model = useLocalModel(OpenFinWindowModel);
    return vframe({
        className: getClassName('openfin-window', props),
        items: [
            titleBar({model}),
            openFinWindowContextProvider({
                value: model,
                items: props.children
            })
        ]
    });
});

const titleBar = hoistElemFactory(props => {
    const model = useProvidedModel(OpenFinWindowModel, props),
        {isDocked, windowState, title, icon} = model;

    if (model.isInTabGroup) return null;

    console.debug('Window State:', windowState);

    return hbox({
        className: 'title-bar',
        items: [
            icon && icon.startsWith('<svg') ?
                <div dangerouslySetInnerHTML={{__html: icon}}/> :
                null,
            box({className: 'title-bar--title', item: title}),
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