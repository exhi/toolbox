import {HoistModel, LoadSupport, XH, RouteSupport} from '@xh/hoist/core';
import {GridModel} from '@xh/hoist/cmp/grid';
import {managed} from '@xh/hoist/core/mixins';
import {actionCol, calcActionColWidth} from '@xh/hoist/desktop/cmp/grid/columns';
import {Icon} from '@xh/hoist/icon/Icon';
import {ChildContainer} from '@xh/hoist/desktop/appcontainer/child/ChildContainer';
import {UserInfoPanel} from '../../cmp/userinfo/UserInfoPanel';
import {UserInfoModel} from '../../cmp/userinfo/UserInfoModel';
import {bindable} from '@xh/hoist/mobx';
import {ChildWindowModel} from '@xh/hoist/window/ChildWindowModel';

@HoistModel
@LoadSupport
@RouteSupport({name: 'userManagement.users'})
export class UserListModel {
    childWindowModel = new ChildWindowModel({name: 'user-info-popout'});

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
                minWidth: 200,
                flex: true
            },
            {
                ...actionCol,
                actionsShowOnHoverOnly: true,
                width: calcActionColWidth(2),
                actions: [
                    {
                        icon: Icon.openExternal(),
                        intent: 'primary',
                        actionFn: async ({record}) => {
                            this.childWindowModel.open({
                                title: 'User Info',
                                url: this.getUserInfoUrl(record)
                            });
                        }
                    },
                    {
                        icon: Icon.openExternal(),
                        intent: 'warning',
                        actionFn: ({record}) => {
                            XH.openSlaveWindowAsync({
                                container: ChildContainer,
                                component: UserInfoPanel,
                                model: this.detailModel
                            });
                        }
                    }
                ]
            }
        ]
    });

    @managed
    detailModel = new UserInfoModel();

    @bindable.ref
    fetchUsersFn = async () => XH.userService.listUsersAsync();

    constructor() {

        this.addReaction({
            track: () => this.gridModel.selectedRecord,
            run: (record) => {
                this.detailModel.setUserId(record ? record.id : null);
                if (this.childWindowModel.isOpen) {
                    this.childWindowModel.navigate('userInfo', {userId: record.id}, {replace: true});
                    this.childWindowModel.setTitle(`User Info - ${record.name}`);
                }
            }
        });

        this.addReaction({
            track: () => this.fetchUsersFn,
            run: () => this.loadAsync()
        });
    }

    getUserInfoUrl(record) {
        return XH.router.buildUrl('userInfo', {userId: record.id});
    }

    async doLoadAsync() {
        const data = await this.fetchUsersFn();
        console.log('Fetched users', data);
        this.gridModel.loadData(data);
    }
}