import {hoistCmp} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {button} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon/Icon';
import {AppModel} from './AppModel';
import {uses} from '@xh/hoist/core/modelspec';
import {localWindowActionPanel} from './LocalWindowActionPanel';

export const App = hoistCmp({
    model: uses(AppModel),
    render: ({model}) => panel({
        item: localWindowActionPanel(),
        tbar: [
            button({
                icon: Icon.openExternal(),
                intent: 'primary',
                text: 'Child Window',
                onClick: () => model.openChildWindow()
            }),
            button({
                icon: Icon.openExternal(),
                intent: 'warning',
                text: 'Slave Window',
                onClick: () => model.openSlaveWindow()
            })
        ]
    })
});