import {XH} from '@xh/hoist/core';
import {App} from '../userManagement/App';
import {AppModel} from '../userManagement/AppModel';
import {ChildContainer} from '@xh/hoist/desktop/appcontainer';

XH.renderChild({
    clientAppCode: 'user-management',
    clientAppName: 'User Management',

    component: App,
    model: AppModel,
    container: ChildContainer
});