import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {ControlsPanel} from './ControlsPanel';
import {ValidationPanel} from './ValidationPanel';
import {ToolbarFormPanel} from './ToolbarFormPanel';


@HoistComponent
export class FormsTab extends Component {

    render() {
        return tabContainer({
            model: {
                route: 'default.forms',
                switcherPosition: 'left',
                tabs: [
                    {id: 'controls', title: 'Hoist Inputs', content: ControlsPanel},
                    {id: 'validation', title: 'Forms', content: ValidationPanel},
                    {id: 'toolbarForm', title: 'Toolbar Forms', content: ToolbarFormPanel}
                ]
            },
            className: 'toolbox-tab'
        });
    }
}
