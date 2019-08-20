import {HoistAppModel} from '@xh/hoist/core';
import {getChildWindowsAsync, createWindowAsync} from '@xh/hoist/openfin/utils';
import {observable, action} from '@xh/hoist/mobx';

@HoistAppModel
export class AppModel {

    /** @member {_Window} */
    @observable gridWindow;

    /** @member {_Window} */
    @observable mapWindow;

    @action
    async toggleGridWindowAsync() {
        let {gridWindow} = this;
        if (!gridWindow) {
            gridWindow = await createWindowAsync('portfolio-grid', {
                autoShow: true,
                frame: false,
                url: '/openfin-child/portfolioGrid'
            });
        } else {
            gridWindow.close();
        }
    }

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