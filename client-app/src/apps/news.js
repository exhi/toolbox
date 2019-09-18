import {XH} from '@xh/hoist/core';
import {App} from '../examples/news/App';
import {AppModel} from '../examples/news/AppModel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderApp({
    clientAppCode: 'news',
    clientAppName: 'News Feed',
    component: App,
    model: AppModel,
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    idleDetectionEnabled: true,
    checkAccess: 'APP_READER',
    loginMessage: "User: 'toolbox@xh.io' / Password: 'toolbox'"
});
