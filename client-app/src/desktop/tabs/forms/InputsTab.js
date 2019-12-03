import {ToolbarFormPanel} from './ToolbarFormPanel';
import {tabContainer} from '@xh/hoist/cmp/tab';
import {hoistCmp} from '@xh/hoist/core';
import {inputTestPanel} from './inputs/InputTestPanel';

export const InputsTab = hoistCmp(
    () => tabContainer({
        model: {
            switcherPosition: 'left',
            tabs: [
                {id: 'testPanel', title: 'Input Test Panel', content: () => inputTestPanel({options: ['foobar', 'selectOnFocus']})},
                {id: 'toolbarForms', title: 'Toolbar Forms', content: ToolbarFormPanel}
            ]
        },
        className: 'toolbox-tab'
    })
);