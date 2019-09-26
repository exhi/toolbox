import {XH} from '@xh/hoist/core';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';
import {LocalWindowActionPanel} from '../windowTester/LocalWindowActionPanel';

XH.renderApp({
    clientAppCode: 'child-window-tester',
    clientAppName: 'Child Window Tester',
    component: LocalWindowActionPanel,
    model: class {},
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: true,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: 'User: \'toolbox@xh.io\' / Password: \'toolbox\''
});