import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {isNil} from 'lodash';

@HoistModel
@LoadSupport
export class UserInfoModel {
    @bindable userId;
    @bindable userInfo;

    constructor() {
        this.addReaction({
            track: () => this.userId,
            run: () => this.loadAsync()
        });
    }

    async doLoadAsync() {
        const {userId} = this;
        if (isNil(userId)) {
            this.setUserInfo(null);
            return;
        }

        const userInfo = await XH.userService.getUserAsync(userId);
        this.setUserInfo(userInfo);
    }
}