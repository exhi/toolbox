import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {getChildWindowsAsync, createWindowAsync, getWindow} from '@xh/hoist/openfin/utils';
import {bindable} from '@xh/hoist/mobx';
import {convertIconToSvg} from '@xh/hoist/icon';

@HoistModel
@LoadSupport
export class LauncherModel {

    @bindable.ref windows = [];

    async createWindow(route, title, icon) {
        const win = await createWindowAsync(`${route}_${XH.genId()}`, {
            url: `/dashboard/${route}`,
            frame: false,
            defaultCentered: true,
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