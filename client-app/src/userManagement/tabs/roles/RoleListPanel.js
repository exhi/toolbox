import {hoistCmp} from '@xh/hoist/core';
import {RoleListModel, RoleUsersListModel} from './RoleListModel';
import {creates, uses} from '@xh/hoist/core/modelspec';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {grid} from '@xh/hoist/cmp/grid';
import {Icon} from '@xh/hoist/icon/Icon';
import {hframe} from '@xh/hoist/cmp/layout';
import {mask} from '@xh/hoist/desktop/cmp/mask';
import {userListPanel} from '../users/UserListPanel';

export const RoleListPanel = hoistCmp({
    model: creates(RoleListModel),
    render: ({model}) => hframe(
        panel({
            icon: Icon.shield(),
            title: 'Roles',
            item: grid(),
            mask: model.loadModel
        }),
        roleUsersListPanel()
    )
});

const roleUsersListPanel = hoistCmp.factory({
    model: uses(RoleUsersListModel, {createDefault: true}),
    render: () => panel({
        model: {
            side: 'right',
            defaultSize: 700
        },
        item: userListPanel(),
        mask: userListMask()
    })
});

const userListMask = hoistCmp.factory({
    render: ({model}) => mask({
        isDisplayed: model.shouldDisplayMask,
        spinner: model.shouldDisplaySpinner,
        message: model.maskMessage
    })
});
