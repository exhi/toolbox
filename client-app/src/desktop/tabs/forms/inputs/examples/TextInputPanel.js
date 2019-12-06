import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {textInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

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
                description: 'Alignment of entry text within control.'}
        ],
        description: [
            p('A single-line text input with additional support for embedded icons/elements.')
        ]
    });
}