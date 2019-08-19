import {Component} from 'react';
import {HoistAppModel, HoistComponent, hoistComponent, useProvidedModel} from '@xh/hoist/core';
import {TabContainerModel, tabContainer} from '@xh/hoist/cmp/tab';
import {Icon} from '@xh/hoist/icon/Icon';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {vframe, hbox, filler, box} from '@xh/hoist/cmp/layout';
import {showDevTools, closeWindow, getWindow, getWindowIdentity} from '@xh/hoist/openfin/utils';
import {snapAndDock} from 'openfin-layouts';
import {observable, runInAction} from '@xh/hoist/mobx';

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
                titleBar({model: this.model}),
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
                        omit: windowState !== WindowState.RESTORED,
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

const WindowState = {
    RESTORED: 'restored',
    MINIMIZED: 'minimized',
    MAXIMIZED: 'maximized'
};

@HoistAppModel
export class ChildWindowModel {
    tabModel = new TabContainerModel({
        switcherPosition: 'none',
        tabs: [
            {
                id: 'portfolioGrid',
                content: () => 'Hello World!'
            }
        ]
    });

    /** @member {_Window} */
    win;

    @observable isDocked;

    @observable windowState;

    async minimizeAsync() {
        return this.win.minimize();
    }

    async maximizeAsync() {
        return this.win.maximize();
    }

    async restoreAsync() {
        return this.win.restore();
    }

    async undockAsync() {
        return snapAndDock.undockWindow();
    }

    getRoutes() {
        return [
            {
                name: 'default',
                path: '/openfin-child',
                children: [
                    {
                        name: 'portfolioGrid',
                        path: '/portfolioGrid'
                    }
                ]
            }
        ];
    }

    async initAsync() {
        const win = getWindow();
        const setWindowState = (state) => runInAction(() => this.windowState = state);
        win.addListener('maximized', () => setWindowState(WindowState.MAXIMIZED));
        win.addListener('minimized', () => setWindowState(WindowState.MINIMIZED));
        win.addListener('restored', () => setWindowState(WindowState.RESTORED));

        const state = await win.getState();
        setWindowState(state);

        this.win = win;

        const setIsDocked = (isDocked) => runInAction(() => this.isDocked = isDocked);
        snapAndDock.addEventListener('window-docked', async () => setIsDocked(true));
        snapAndDock.addEventListener('window-undocked', async () => setIsDocked(false));

        const dockGroup = await snapAndDock.getDockedWindows(getWindowIdentity());
        setIsDocked(!!dockGroup);
    }
}