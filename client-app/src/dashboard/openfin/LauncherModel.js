import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {
    getChildWindowsAsync,
    createWindowAsync,
    getWindow,
    isRunningInOpenFin, getApplication
} from '@xh/hoist/openfin/utils';
import {bindable} from '@xh/hoist/mobx';
import {convertIconToSvg} from '@xh/hoist/icon';
import * as Notifications from 'openfin-notifications';
import {workspaces, restoreHelpers} from 'openfin-layouts';
import {wait} from '@xh/hoist/promise';
import {isEmpty} from 'lodash';

@HoistModel
@LoadSupport
export class LauncherModel {

    @bindable.ref windows = [];

    constructor() {
        if (isRunningInOpenFin() && getWindow().isMainWindow()) {
            const app = getApplication();

            // --------------------------
            // Misc. OpenFin App Init
            app.setTrayIcon('http://localhost:3000/public/trayicon.png');
            app.addListener('tray-icon-clicked', event => {
                const {button} = event;
                let buttonName;
                switch (button) {
                    case 0:
                        buttonName = 'left';
                        break;
                    case 1:
                        buttonName = 'middle';
                        break;
                    case 2:
                        buttonName = 'right';
                        break;
                }

                const id = `xh-dashboard-notification-${XH.genId()}`;
                Notifications.create({
                    id,
                    title: 'System Tray Icon Clicked!',
                    body: `The ${buttonName} mouse button was clicked`,
                    category: 'XH Dashboard',
                    icon: 'https://localhost:3000/public/xh.png'
                });

                wait(5000).then(() => Notifications.clear(id));
            });

            // ----------------------------
            // OpenFin Workspace Init
            workspaces.setRestoreHandler((workspaceApp) => {
                console.debug('Workspace Restore', workspaceApp);
                this.restoreAppWorkspaceAsync(workspaceApp);
            });

            workspaces.setGenerateHandler(() => {
                console.debug('Workspace Generate Handler');


            });

            workspaces.ready().then(workspace => console.debug('Workspace Ready', workspace));
        }
    }

    async saveLayoutAsync() {
        const workspace = await workspaces.generate();
        console.debug(workspace);

        XH.setPref('dashboardLayoutConfig', workspace);
    }

    async restoreLayoutAsync() {
        /** @type {Workspace} */
        const layoutConfig = XH.getPref('dashboardLayoutConfig');
        if (!isEmpty(layoutConfig)) {
            // The workspace we are restoring here is actually a multi-app workspace. There is no
            // way to restore an app workspace on its own.
            const result = await workspaces.restore(layoutConfig);
            console.debug('Workspace Restore Result', result);
        }
    }

    /** @param {WorkspaceApp} workspaceApp */
    async restoreAppWorkspaceAsync(workspaceApp) {
        const {childWindows} = workspaceApp;
        await Promise.all(childWindows.map(childWnd => restoreHelpers.createOrPositionChild(childWnd)));
    }

    async createWindow(route, title, icon) {
        const win = await createWindowAsync(`${route}_${XH.genId()}`, {
            url: `/dashboard/${route}`,
            frame: false,
            defaultCentered: true,
            defaultWidth: 1200,
            defaultHeight: 1200,
            saveWindowState: false, // Since we will end up re-using ids, don't save window state
            customData: JSON.stringify({title, icon: convertIconToSvg(icon)})
        });

        this.setWindows([...this.windows, win]);
    }

    async doLoadAsync(loadSpec) {
        if (getWindow().isMainWindow()) {
            const childWindows = await getChildWindowsAsync();
            console.debug('Doing load on child windows', childWindows);
            childWindows.forEach(wnd => {
                const webWindow = wnd.getWebWindow();
                if (!webWindow) {
                    console.warn('Could not get Web Window for', wnd);
                    return;
                }

                const {XH} = webWindow;
                XH.refreshContextModel.doLoadAsync(loadSpec);
            });
        }
    }
}