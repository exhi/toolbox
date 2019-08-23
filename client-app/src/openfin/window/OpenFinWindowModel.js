import {HoistModel} from '@xh/hoist/core';
import {snapAndDock, tabbing} from 'openfin-layouts';
import {observable, runInAction} from '@xh/hoist/mobx';
import {getWindow, getWindowIdentity} from '@xh/hoist/openfin/utils';

export const WindowState = {
    NORMAL: 'normal',
    MINIMIZED: 'minimized',
    MAXIMIZED: 'maximized'
};

@HoistModel
export class OpenFinWindowModel {
    /** @member {_Window} */
    win;

    @observable isDocked;

    @observable windowState;

    @observable isInTabGroup = false;

    constructor() {
        this.initAsync();
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
    }
}