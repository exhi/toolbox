import {hoistCmp} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {InputsPanel} from './InputsPanel';
import {FormPanel} from './FormPanel';
import {ToolbarFormPanel} from './ToolbarFormPanel';
import {InputsTab} from './InputsTab';

export const FormsTab = hoistCmp(
    () => tabContainer({
        model: {
            route: 'default.forms',
            switcherPosition: 'left',
            tabs: [
                {id: 'form', title: 'FormModel', content: FormPanel},
                {id: 'inputs', title: 'Hoist Inputs', content: InputsPanel},
                {id: 'toolbarForm', title: 'Toolbar Forms', content: ToolbarFormPanel},
                {id: 'inputsTab', title: 'Inputs Tab', content: InputsTab}
            ]
        },
        className: 'toolbox-tab'
    })
);
