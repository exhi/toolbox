import {hoistCmp, XH} from '@xh/hoist/core';
import {AppModel} from './AppModel';
import {uses} from '@xh/hoist/core/modelspec';
import {userListPanel} from './UserListPanel';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {vframe} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon/Icon';

export const App = hoistCmp({
    model: uses(AppModel),
    render: () => vframe(
        appBar({
            icon: Icon.user({size: '2x'}),
            title: XH.clientAppName,
            hideRefreshButton: true
        }),
        userListPanel()
    )
});