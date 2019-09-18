import {HoistModel, LoadSupport, XH, RouteSupport} from '@xh/hoist/core';
import {GridModel, emptyFlexCol} from '@xh/hoist/cmp/grid';
import {managed} from '@xh/hoist/core/mixins';
import {UserInfoModel} from './UserInfoModel';
import {actionCol, calcActionColWidth} from '@xh/hoist/desktop/cmp/grid/columns';
import {Icon} from '@xh/hoist/icon/Icon';

@HoistModel
@LoadSupport
@RouteSupport({name: 'default.users'})
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
            },
            emptyFlexCol,
            {
                ...actionCol,
                actionsShowOnHoverOnly: true,
                width: calcActionColWidth(1),
                actions: [
                    {
                        icon: Icon.openExternal(),
                        intent: 'primary',
                        actionFn: ({record}) => {
                            window.open(XH.router.buildUrl('default.userInfo', {userId: record.id}), '_blank');
                        }
                    }
                ]
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