import {XH} from '@xh/hoist/core';
import {App} from '../examples/portfolio/App';
import {AppModel} from '../examples/portfolio/AppModel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderApp({
    clientAppCode: 'portfolio',
    clientAppName: 'Portfolio',
    component: App,
    model: AppModel,
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: true,
    idleDetectionEnabled: true,
    checkAccess: 'APP_READER',
    loginMessage: '👤 toolbox@xh.io + 🔑 toolbox'
});
