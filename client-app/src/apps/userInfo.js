import {XH} from '@xh/hoist/core';
import {UserInfoModel} from '../userManagement/UserInfoModel';
import {UserInfoPanel} from '../userManagement/UserInfoPanel';
import {AppContainer} from '@xh/hoist/desktop/appcontainer';
import {UserService} from '../userManagement/UserService';

XH.renderApp({
    clientAppCode: 'user-info',
    clientAppName: 'User Info',
    component: UserInfoPanel,
    model: UserInfoModel,
    container: AppContainer,
    isMobile: false,
    isSSO: false,
    webSocketsEnabled: true,
    idleDetectedEnabled: false,
    checkAccess: 'APP_READER',
    loginMessage: 'User: \'toolbox@xh.io\' / Password: \'toolbox\'',
    services: [UserService]
});