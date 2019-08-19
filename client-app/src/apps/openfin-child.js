import {XH} from '@xh/hoist/core';
import {ChildWindowAppContainer} from '@xh/hoist/openfin/appcontainer';
import {ChildWindow, ChildWindowModel} from '../openfin/ChildWindow';

XH.renderApp({
    clientAppCode: 'openfin-child-window',
    clientAppName: 'OpenFin Child Window',
    componentClass: ChildWindow,
    modelClass: ChildWindowModel,
    containerClass: ChildWindowAppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: false,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: "User: 'toolbox@xh.io' / Password: 'toolbox'"
});