import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {select} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {usStates} from '../../../../core/data';
import {li, p, ul} from '@xh/hoist/cmp/layout';

export const SelectPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: select,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'autoFocus', value: true, type: 'bool',
                description: 'True to focus the control on render.'},
            {name: 'selectOnFocus', value: false, type: 'bool',
                description: 'True to select contents when control receives focus.'},
            {name: 'enableClear', value: false, type: 'bool',
                description: 'True to show a "clear" button at the right of the control.'},
            {name: 'enableFilter', value: false, type: 'bool',
                description:
                    'True to enable type-to-search keyboard input. False to disable keyboard input,' +
                    'showing the dropdown menu on click.'},
            {name: 'enableMulti', value: false, type: 'bool',
                description: 'True to allow entry/selection of multiple values - "tag picker" style.'},
            {name: 'hideSelectedOptionCheck', value: false, type: 'bool',
                description: 'True to suppress the default check icon rendered for the currently selected option.'},
            {name: 'menuPlacement', value: 'auto', type: 'select',
                options: ['auto', 'top', 'bottom'],
                description: 'Placement of the dropdown menu relative to the input control.'},
            {name: 'placeholder', value: undefined, type: 'text',
                description: 'Text to display when control is empty.'}
        ],
        fixedParams: {
            options: usStates
        },
        description: [
            p('A managed wrapper around the React-Select combobox/dropdown component.'),
            p('Supports advanced options such as:'),
            ul(
                li('Asynchronous queries'),
                li('Multiple selection'),
                li('Custom dropdown option renderers'),
                li('User-created ad-hoc entries')
            )
        ]
    });
}