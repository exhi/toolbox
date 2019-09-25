import {hoistCmp, XH} from '@xh/hoist/core';
import {AppModel} from './AppModel';
import {uses} from '@xh/hoist/core/modelspec';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {vframe} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon/Icon';
import {tabContainer} from '@xh/hoist/cmp/tab';
import {tabSwitcher} from '@xh/hoist/desktop/cmp/tab';

export const App = hoistCmp({
    model: uses(AppModel),
    render: () => vframe(
        appBar({
            icon: Icon.user({size: '2x'}),
            title: XH.clientAppName,
            leftItems: [
                tabSwitcher()
            ]
        }),
        tabContainer()
    )
});