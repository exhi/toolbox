import {XH} from '@xh/hoist/core';
import {App} from '../dashboard/App';
import {AppModel} from '../dashboard/AppModel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderApp({
    clientAppCode: 'dashboard',
    clientAppName: 'Dashboard',
    componentClass: App,
    modelClass: AppModel,
    containerClass: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: false,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: "User: 'toolbox@xh.io' / Password: 'toolbox'"
});