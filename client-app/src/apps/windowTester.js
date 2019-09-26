import {XH} from '@xh/hoist/core';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';
import {App} from '../windowTester/App';
import {AppModel} from '../windowTester/AppModel';

XH.renderApp({
    clientAppCode: 'window-tester',
    clientAppName: 'Window Tester',
    component: App,
    model: AppModel,
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: true,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: 'User: \'toolbox@xh.io\' / Password: \'toolbox\''
});