import {HoistModel} from '@xh/hoist/core';
import {snapAndDock, tabbing} from 'openfin-layouts';
import {action, bindable, observable, runInAction} from '@xh/hoist/mobx';
import {getWindow, getWindowIdentity} from '@xh/hoist/openfin/utils';
import {isEmpty} from 'lodash';

export const WindowState = {
    NORMAL: 'normal',
    MINIMIZED: 'minimized',
    MAXIMIZED: 'maximized'
};

@HoistModel
export class OpenFinWindowModel {

    @bindable title = '';

    @bindable icon = '';

    /** @member {_Window} */
    win;

    @observable isDocked;

    @observable windowState;

    @observable isInTabGroup = false;

    @bindable.ref options;

    constructor() {
        this.initAsync();

        this.addReaction({
            track: () => this.options,
            run: () => this.syncStateToWindowOptions()
        });

        this.addAutorun(this.updateTabPropertiesAsync);
    }

    @action
    syncStateToWindowOptions() {
        const {options} = this;
        if (!options) return;

        const {customData} = options;
        if (!isEmpty(customData)) {
            const data = JSON.parse(customData);
            this.title = data.title;
            this.icon = data.icon;
        }
    }

    async updateTabPropertiesAsync() {
        const {title, icon} = this;
        console.debug('Updating Tab Properties', {title, icon});
        return tabbing.updateTabProperties({title, icon});
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

        this.setOptions(await win.getOptions());

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