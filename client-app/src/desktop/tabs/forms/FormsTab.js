import {hoistCmp} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {FormPanel} from './FormPanel';
import {ToolbarFormPanel} from './ToolbarFormPanel';
import {InputsTab} from './inputs/InputsTab';

export const FormsTab = hoistCmp(
    () => tabContainer({
        model: {
            route: 'default.forms',
            switcherPosition: 'left',
            tabs: [
                {id: 'form', title: 'FormModel', content: FormPanel},
                {id: 'inputs', title: 'Inputs', content: InputsTab},
                {id: 'toolbarForm', title: 'Toolbar Forms', content: ToolbarFormPanel}
            ]
        },
        className: 'toolbox-tab'
    })
);
