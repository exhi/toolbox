import {HoistModel, XH} from '@xh/hoist/core';
import {ChildContainer} from '@xh/hoist/desktop/appcontainer/child/ChildContainer';
import {LocalWindowActionPanel} from './LocalWindowActionPanel';

@HoistModel
export class AppModel {

    openChildWindow() {
        XH.openChildWindowAsync('/childWindowTester');
    }

    openSlaveWindow() {
        XH.openSlaveWindowAsync({
            container: ChildContainer,
            component: LocalWindowActionPanel,
            model: class {}
        });
    }
}