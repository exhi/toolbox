import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {GridModel, emptyFlexCol} from '@xh/hoist/cmp/grid';
import {managed} from '@xh/hoist/core/mixins';
import {UserInfoModel} from './UserInfoModel';
import {actionCol, calcActionColWidth} from '@xh/hoist/desktop/cmp/grid/columns';
import {Icon} from '@xh/hoist/icon/Icon';
import {ChildContainer} from '@xh/hoist/desktop/appcontainer/child/ChildContainer';
import {UserInfoPanel} from './UserInfoPanel';

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
            },
            emptyFlexCol,
            {
                ...actionCol,
                actionsShowOnHoverOnly: true,
                width: calcActionColWidth(2),
                actions: [
                    {
                        icon: Icon.openExternal(),
                        intent: 'primary',
                        actionFn: ({record}) => {
                            // window.open(`/userDetails?userId=${record.id}`, '_blank', 'height=300,width=300,menubar=no');
                            XH.openChildWindow(XH.router.buildUrl('userInfo', {userId: record.id}));
                        }
                    },
                    {
                        icon: Icon.openExternal(),
                        intent: 'warning',
                        actionFn: ({record}) => {
                            XH.openSlaveWindow({
                                container: ChildContainer,
                                component: UserInfoPanel,
                                model: UserInfoModel
                            });
                        }
                    }
                ]
            }
        ]
    })

    @managed
    detailModel = new UserInfoModel()

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