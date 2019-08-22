import {HoistAppModel, XH} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {Icon, convertIconToSvg} from '@xh/hoist/icon';
import {snapAndDock, tabbing} from 'openfin-layouts';
import {gridPanel} from '../../examples/portfolio/GridPanel';
import {mapPanel} from '../../examples/portfolio/MapPanel';
import {observable, runInAction} from '@xh/hoist/mobx';
import {getWindow, getWindowIdentity} from '@xh/hoist/openfin/utils';
import {PortfolioService} from '../../core/svc/PortfolioService';
import {PortfolioPanelModel} from '../../examples/portfolio/PortfolioPanelModel';

export const WindowState = {
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