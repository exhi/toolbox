import {hoistCmp} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {FormPanel} from './FormPanel';
import {ToolbarFormPanel} from './ToolbarFormPanel';

export const FormsTab = hoistCmp(
    () => tabContainer({
        model: {
            route: 'default.forms',
            switcherPosition: 'left',
            tabs: [
                {id: 'form', title: 'FormModel', content: FormPanel},
                {id: 'toolbarForm', title: 'Toolbar Forms', content: ToolbarFormPanel}
            ]
        },
        className: 'toolbox-tab'
    })
);
