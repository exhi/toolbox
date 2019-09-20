import {XH} from '@xh/hoist/core';
import {ChildContainer} from '@xh/hoist/desktop/appcontainer';
import {UserInfoModel} from '../userManagement/UserInfoModel';
import {UserInfoPanel} from '../userManagement/UserInfoPanel';

XH.renderChild({
    component: UserInfoPanel,
    model: UserInfoModel,
    container: ChildContainer
});