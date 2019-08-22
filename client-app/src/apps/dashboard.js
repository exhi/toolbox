import {XH} from '@xh/hoist/core';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {OpenFinApp} from '../dashboard/openfin-app/OpenFinApp';
import {BrowserApp} from '../dashboard/browser-app/BrowserApp';
import {OpenFinAppModel} from '../dashboard/openfin-app/OpenFinAppModel';
import {BrowserAppModel} from '../dashboard/browser-app/BrowserAppModel';

XH.renderApp({
    clientAppCode: 'dashboard',
    clientAppName: 'Dashboard',
    componentClass: isRunningInOpenFin() ? OpenFinApp : BrowserApp,
    modelClass: isRunningInOpenFin() ? OpenFinAppModel : BrowserAppModel,
    containerClass: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: false,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: 'User: \'toolbox@xh.io\' / Password: \'toolbox\''
});