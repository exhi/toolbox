import {Component} from 'react';
import {HoistComponent, hoistComponent, useProvidedModel} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';
import {Icon} from '@xh/hoist/icon/Icon';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {vframe, hbox, filler, box} from '@xh/hoist/cmp/layout';
import {showDevTools, closeWindow} from '@xh/hoist/openfin/utils';

import {WindowState, ChildWindowModel} from './ChildWindowModel';
import './ChildWindow.scss';

@HoistComponent
export class ChildWindow extends Component {
    baseClassName = 'openfin-child-window';

    render() {
        const {model} = this,
            {tabModel} = model;

        return vframe({
            className: this.getClassName(),
            items: [
                titleBar({omit: model.isInTabGroup, model}),
                tabContainer({
                    model: tabModel
                })
            ]
        });
    }
}

const [, titleBar] = hoistComponent(props => {
    const model = useProvidedModel(ChildWindowModel, props),
        {tabModel, isDocked, windowState} = model,
        {activeTab} = tabModel;

    console.debug('Window State:', windowState);

    return hbox({
        className: 'title-bar',
        items: [
            box({
                className: 'title-bar--title',
                item: activeTab.title
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