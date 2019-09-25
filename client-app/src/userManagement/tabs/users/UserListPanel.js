import {hoistCmp} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {vframe} from '@xh/hoist/cmp/layout';
import {UserListModel} from './UserListModel';
import {uses} from '@xh/hoist/core/modelspec';
import {grid} from '@xh/hoist/cmp/grid';
import {userInfoPanel} from '../../cmp/userinfo/UserInfoPanel';
import {Icon} from '@xh/hoist/icon/Icon';

export const [UserListPanel, userListPanel] = hoistCmp.withFactory({
    model: uses(UserListModel, {createDefault: true}),
    render: ({model}) => panel({
        icon: Icon.users(),
        title: 'Users',
        item: vframe(
            grid(),
            panel({
                model: {
                    side: 'bottom',
                    defaultSize: 400
                },
                item: userInfoPanel()
            })
        ),
        mask: model.loadModel
    })
});