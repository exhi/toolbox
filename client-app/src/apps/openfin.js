import {XH} from '@xh/hoist/core';
import {App} from '../openfin/App';
import {AppModel} from '../openfin/AppModel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderApp({
    clientAppCode: 'openfin-example',
    clientAppName: 'OpenFin Example',
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