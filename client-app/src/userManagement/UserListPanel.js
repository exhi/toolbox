import {hoistCmp} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {vframe} from '@xh/hoist/cmp/layout';
import {UserListModel} from './UserListModel';
import {creates} from '@xh/hoist/core/modelspec';
import {grid} from '@xh/hoist/cmp/grid';
import {userInfoPanel} from './UserInfoPanel';
import {Icon} from '@xh/hoist/icon/Icon';

export const userListPanel = hoistCmp.factory({
    model: creates(UserListModel),
    render: ({model}) => panel({
        icon: Icon.users(),
        title: 'Users',
        item: vframe(
            grid(),
            userInfoPanel()
        ),
        mask: model.loadModel
    })
});