import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {GridModel} from '@xh/hoist/cmp/grid';
import {managed} from '@xh/hoist/core/mixins';
import {UserInfoModel} from './UserInfoModel';

@HoistModel
@LoadSupport
export class UserListModel {
    @managed
    gridModel = new GridModel({
        colDefaults: {
            width: 200
        },
        columns: [
            {
                field: 'name'
            },
            {
                field: 'username'
            },
            {
                field: 'email',
                width: 300
            }
        ]
    });

    @managed
    detailModel = new UserInfoModel();

    constructor() {
        this.addReaction({
            track: () => this.gridModel.selectedRecord,
            run: (record) => this.detailModel.setUserId(record ? record.id : null)
        });

        this.loadAsync();
    }

    async doLoadAsync() {
        const data = await XH.userService.listUsersAsync();
        this.gridModel.loadData(data);
    }
}