import {hoistCmp} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon/Icon';
import {uses} from '@xh/hoist/core/modelspec';
import {UserInfoModel} from './UserInfoModel';
import {mask} from '@xh/hoist/desktop/cmp/mask';
import {vframe, hframe, span} from '@xh/hoist/cmp/layout';

export const [UserInfoPanel, userInfoPanel] = hoistCmp.withFactory({
    model: uses(UserInfoModel, {createDefault: true}),
    render({model}) {
        const {loadModel} = model;
        return panel({
            icon: Icon.info(),
            title: 'User Info',
            compactHeader: true,
            item: userInfo(),
            mask: loadModel
        });
    }
});

const userInfo = hoistCmp.factory({
    className: 'user-info',
    render({model, className}) {
        const {userInfo} = model;
        if (!userInfo) {
            return mask({
                isDisplayed: true,
                message: 'Select a User to see their info'
            });
        }

        const {
            name,
            username,
            email,
            phone,
            website
        } = userInfo;

        return hframe({
            className,
            items: [
                vframe(
                    span({className: 'name', item: name}),
                    span({className: 'username', item: username}),
                    span({className: 'website', item: website})
                ),
                vframe(
                    span({className: 'email', item: email}),
                    span({className: 'phone', item: phone})

                )
            ]
        });
    }
});