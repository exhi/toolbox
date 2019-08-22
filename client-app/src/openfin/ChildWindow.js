import {Component} from 'react';
import {HoistAppModel, HoistComponent, hoistComponent, useProvidedModel, XH} from '@xh/hoist/core';
import {TabContainerModel, tabContainer} from '@xh/hoist/cmp/tab';
import {Icon, convertIconToSvg} from '@xh/hoist/icon/Icon';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {vframe, hbox, filler, box} from '@xh/hoist/cmp/layout';
import {showDevTools, closeWindow, getWindow, getWindowIdentity} from '@xh/hoist/openfin/utils';
import {snapAndDock, tabbing} from 'openfin-layouts';
import {observable, runInAction} from '@xh/hoist/mobx';

import './ChildWindow.scss';
import {PortfolioPanelModel} from '../examples/portfolio/PortfolioPanelModel';
import {gridPanel} from '../examples/portfolio/GridPanel';
import {PortfolioService} from '../core/svc/PortfolioService';
import {mapPanel} from '../examples/portfolio/MapPanel';

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

const WindowState = {
    NORMAL: 'normal',
    MINIMIZED: 'minimized',
    MAXIMIZED: 'maximized'
};

@HoistAppModel
export class ChildWindowModel {

    tabModel = new TabContainerModel({
        switcherPosition: 'none',
        route: 'default',
        tabs: [
            {
                id: 'portfolioGrid',
                icon: Icon.portfolio(),
                title: 'Positions',
                content: () => gridPanel({model: this.portfolioPanelModel.gridPanelModel})
            },
            {
                id: 'portfolioMap',
                icon: Icon.gridPanel(),
                title: 'P&L Tree Map',
                content: () => mapPanel({model: this.portfolioPanelModel.mapPanelModel, inWindow: true})
            }
        ]
    });

    /** @member {_Window} */
    win;

    @observable isDocked;

    @observable windowState;

    @observable isInTabGroup = false;

    constructor() {
        this.addAutorun(this.updateTabProperties);
    }

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

    async doLoadAsync(loadSpec) {
        await this.portfolioPanelModel.doLoadAsync(loadSpec);
    }

    get useCompactGrids() {
        return XH.getPref('defaultGridMode') == 'COMPACT';
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
                    },
                    {
                        name: 'portfolioMap',
                        path: '/portfolioMap'
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
        win.addListener('restored', () => setWindowState(WindowState.NORMAL));

        const state = await win.getState();
        setWindowState(state);

        this.win = win;

        const setIsDocked = (isDocked) => runInAction(() => this.isDocked = isDocked);
        snapAndDock.addEventListener('window-docked', async () => setIsDocked(true));
        snapAndDock.addEventListener('window-undocked', async () => setIsDocked(false));

        const dockGroup = await snapAndDock.getDockedWindows(getWindowIdentity());
        setIsDocked(!!dockGroup);

        const setIsInTabGroup = (isInTabGroup) => runInAction(() => this.isInTabGroup = isInTabGroup);
        tabbing.addEventListener('tab-added', async (event) => {
            console.debug('TabAddedEvent', event);
            setIsInTabGroup(true);
        });
        tabbing.addEventListener('tab-removed', async (event) => {
            console.debug('TabRemovedEvent', event);
            setIsInTabGroup(false);
        });

        const tabGroup = await tabbing.getTabs();
        setIsInTabGroup(!!tabGroup);

        await XH.installServicesAsync(PortfolioService);

        this.portfolioPanelModel = new PortfolioPanelModel();

        this.doLoadAsync();
    }

    updateTabProperties() {
        const {activeTab} = this.tabModel;
        if (activeTab && this.isInTabGroup) {
            const {title, icon} = activeTab,
                properties = {title, icon: icon ? convertIconToSvg(icon) : undefined};

            console.debug('Updating Tab Properties', properties);
            tabbing.updateTabProperties(properties);
        }
    }
}