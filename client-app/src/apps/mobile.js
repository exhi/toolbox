import {XH} from '@xh/hoist/core';
import {App} from '../mobile/App';
import {AppModel} from '../mobile/AppModel';
import {AppContainer} from '@xh/hoist/mobile/appcontainer';

XH.renderApp({
    clientAppCode: 'mobile',
    clientAppName: 'Toolbox Mobile',
    component: App,
    model: AppModel,
    container: AppContainer,
    isMobile: true,
    isSSO: false,
    checkAccess: 'APP_READER',
    loginMessage: "User: 'toolbox@xh.io' / Password: 'toolbox'"
});
