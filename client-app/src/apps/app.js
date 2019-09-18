import {XH} from '@xh/hoist/core';
import {App} from '../desktop/App';
import {AppModel} from '../desktop/AppModel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderApp({
    clientAppCode: 'app',
    clientAppName: 'Toolbox',
    component: App,
    model: AppModel,
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: true,
    idleDetectionEnabled: true,
    checkAccess: 'APP_READER',
    loginMessage: "User: 'toolbox@xh.io' / Password: 'toolbox'"
});
