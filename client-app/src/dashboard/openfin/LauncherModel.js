import {HoistModel} from '@xh/hoist/core';
import {getChildWindowsAsync, createWindowAsync} from '@xh/hoist/openfin/utils';

@HoistModel
export class LauncherModel {

    async initAsync() {
        // TODO: Launch some windows!
        //       First we probably want to check if there are any open child windows, and close them
        //       since we may have just refreshed the app from a code change.
        //       Then we can re-create from our default initial state for the application
        //       In the future we will want to load the last layout? Or does that happen automatically?

        const childWindows = await getChildWindowsAsync();
        childWindows.forEach(win => {
            win.close();
        });

        createWindowAsync('portfolio-grid', {
            autoShow: true,
            frame: false,
            url: '/openfin-child/portfolioGrid'
        });

        createWindowAsync('portfolio-map', {
            autoShow: true,
            frame: false,
            url: '/openfin-child/portfolioMap'
        });
    }
}