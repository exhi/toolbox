import {HoistModel, LoadSupport, RouteSupport, XH} from '@xh/hoist/core';
import {managed} from '@xh/hoist/core/mixins';
import {GridModel} from '@xh/hoist/cmp/grid';
import {bindable} from '@xh/hoist/mobx';
import {UserListModel} from '../users/UserListModel';
import {resolve} from '@xh/hoist/promise';

@HoistModel
@LoadSupport
@RouteSupport({name: 'userManagement.roles'})
export class RoleListModel {
    @managed
    rolesGridModel = new GridModel({
        columns: [
            {
                field: 'name',
                width: 140
            },
            {
                field: 'description',
                width: 300
            }
        ]
    });

    @managed
    rolesUsersListModel = new RoleUsersListModel();

    constructor() {
        this.addReaction({
            track: () => this.rolesGridModel.selectedRecord,
            run: (record) => this.rolesUsersListModel.setSelectedRole(record)
        });
    }

    async doLoadAsync() {
        const data = await XH.userService.listRolesAsync();
        this.rolesGridModel.loadData(data);
    }
}

@HoistModel
@LoadSupport
export class RoleUsersListModel {
    @bindable
    selectedRole;

    userListModel = new UserListModel();

    get shouldDisplayMask() {
        return !this.selectedRole || this.loadModel.isPending;
    }

    get maskMessage() {
        if (!this.selectedRole) {
            return 'Select a Role';
        }

        return null;
    }

    get shouldDisplaySpinner() {
        return this.loadModel.isPending;
    }

    constructor() {
        this.addReaction({
            track: () => this.selectedRole,
            run: (record) => {
                if (record) {
                    this.userListModel.setFetchUsersFn(async () => XH.userService.getUsersWithRoleAsync(record.id));
                } else {
                    this.userListModel.setFetchUsersFn(async () => resolve([]));
                }
            },
            fireImmediately: true
        });
    }

    async doLoadAsync() {
        const {selectedRole} = this;
        if (!selectedRole) {
            this.gridModel.clear();
            return;
        }

        const data = await XH.userService.getUsersWithRole(selectedRole.id);
        this.gridModel.loadData(data);
    }
}