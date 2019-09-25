import {RouteSupport, HoistModel, managed} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {UserListPanel} from './tabs/users/UserListPanel';
import {RoleListPanel} from './tabs/roles/RoleListPanel';

@HoistModel
@RouteSupport({name: 'userManagement', forwardTo: 'userManagement.users'})
export class AppModel {
    @managed
    tabModel = new TabContainerModel({
        route: 'userManagement',
        switcherPosition: 'none',
        tabs: [
            {
                id: 'users',
                content: UserListPanel
            },
            {
                id: 'roles',
                content: RoleListPanel
            }
        ]
    });
}