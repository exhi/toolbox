import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {textInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon/Icon';

export const TextInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: textInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'autoFocus', value: true, type: 'bool',
                description: 'True to focus the control on render.'},
            {name: 'selectOnFocus', value: false, type: 'bool',
                description: 'True to select contents when control receives focus.'},
            {name: 'commitOnChange', value: false, type: 'bool',
                description: 'True to commit on every change/keystroke.'},
            {name: 'enableClear', value: false, type: 'bool',
                description: 'True to show a "clear" button as the right element'},
            {name: 'round', value: false, type: 'bool',
                description: 'True to display with rounded caps.'},
            {name: 'spellCheck', value: true, type: 'bool',
                description: 'True to allow browser spell check.'},
            {name: 'placeholder', value: undefined, type: 'text',
                description: 'Text to display when control is empty.'},
            {name: 'textAlign', value: 'left', type: 'select',
                options: ['left', 'right'],
                description: 'Alignment of entry text within control.'},
            {name: 'leftIcon', value: null, type: 'select',
                options: [
                    null,
                    {label: 'rocket', value: Icon.rocket()},
                    {label: 'bookmark', value: Icon.bookmark()}
                ],
                description: 'Icon to display inline on the left side of the input.'}
        ],
        description: [
            p('A single-line text input with additional support for embedded icons/elements.')
        ]
    });
}