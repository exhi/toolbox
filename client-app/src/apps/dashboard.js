import {XH} from '@xh/hoist/core';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';
import {App} from '../dashboard/App';
import {AppModel} from '../dashboard/AppModel';
import {isRunningInOpenFin, getWindow} from '@xh/hoist/openfin/utils';
import {ChildWindowAppContainer} from '@xh/hoist/openfin/appcontainer';

XH.renderApp({
    clientAppCode: 'dashboard',
    clientAppName: 'Dashboard',
    componentClass: App,
    modelClass: AppModel,
    containerClass: getContainerClass(),
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: true,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: 'User: \'toolbox@xh.io\' / Password: \'toolbox\''
});

function getContainerClass() {
    if (isRunningInOpenFin()) {
        const isMainWnd = getWindow().isMainWindow();
        return isMainWnd ? AppContainer : ChildWindowAppContainer;
    }

    return AppContainer;
}