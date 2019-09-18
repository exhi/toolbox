import {XH} from '@xh/hoist/core';
import {App} from '../examples/filemanager/App';
import {AppModel} from '../examples/filemanager/AppModel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderApp({
    clientAppCode: 'fileManager',
    clientAppName: 'File Manager',
    component: App,
    model: AppModel,
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    idleDetectionEnabled: true,
    checkAccess: 'HOIST_ADMIN',
    loginMessage: "User: 'admin@xh.io' / Contact us for Access"
});
