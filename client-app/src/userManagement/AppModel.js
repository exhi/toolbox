import {XH, HoistAppModel, RouteSupport, managed} from '@xh/hoist/core';
import {UserService} from './UserService';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {UserListPanel} from './UserListPanel';
import {UserInfoPanel} from './UserInfoPanel';

@HoistAppModel
@RouteSupport({name: 'default', path: '/userManagement', forwardTo: 'default.users'})
export class AppModel {
    @managed
    tabModel = new TabContainerModel({
        route: 'default',
        defaultTabId: 'users',
        switcherPosition: 'none',
        tabs: [
            {
                id: 'users',
                content: UserListPanel
            },
            {
                id: 'userInfo',
                content: UserInfoPanel
            }
        ]
    });

    async initAsync() {
        await XH.installServicesAsync(UserService);
    }

    getRoutes() {
        return RouteSupport.getRoutes();
    }
}