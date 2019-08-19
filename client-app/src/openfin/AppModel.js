import {HoistAppModel} from '@xh/hoist/core';
import {getChildWindowsAsync, createWindowAsync} from '@xh/hoist/openfin/utils';

@HoistAppModel
export class AppModel {

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

        let win = await createWindowAsync('example-child', {
            autoShow: true,
            frame: false,
            url: '/openfin-child/portfolioGrid'
        });
        win.showDeveloperTools();

        win = await createWindowAsync('example-child-2', {
            autoShow: true,
            frame: false,
            url: '/openfin-child/portfolioGrid'
        });
        win.showDeveloperTools();
    }
}