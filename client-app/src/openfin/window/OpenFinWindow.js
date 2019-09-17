import React from 'react';
import {hoistCmp, creates, uses} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon/Icon';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {vframe, hbox, filler, box} from '@xh/hoist/cmp/layout';
import {showDevTools, closeWindow} from '@xh/hoist/openfin/utils';

import {WindowState, OpenFinWindowModel} from './OpenFinWindowModel';
import './OpenFinWindow.scss';

export const openFinWindow = hoistCmp.factory({
    model: creates(OpenFinWindowModel),
    className: 'openfin-window',
    render: ({model, children}) => {
        return vframe({
            items: [
                titleBar({model}),
                ...children
            ]
        });
    }
});

const titleBar = hoistCmp.factory({
    model: uses(OpenFinWindowModel),
    className: 'title-bar',
    render: ({model}) => {
        const {isDocked, windowState, title, icon} = model;

        if (model.isInTabGroup) return null;

        console.debug('Window State:', windowState);

        return hbox({
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
    }
});