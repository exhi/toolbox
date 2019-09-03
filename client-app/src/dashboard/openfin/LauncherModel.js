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
import {wait} from '@xh/hoist/promise';

@HoistModel
@LoadSupport
export class LauncherModel {

    @bindable.ref windows = [];

    constructor() {
        if (isRunningInOpenFin() && getWindow().isMainWindow()) {
            const app = getApplication();
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
        }
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