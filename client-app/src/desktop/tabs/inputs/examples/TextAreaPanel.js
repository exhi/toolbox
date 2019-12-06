import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {textArea} from '@xh/hoist/desktop/cmp/input';
import {p} from '@xh/hoist/cmp/layout';

export const TextAreaPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: textArea,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'autoFocus', value: true, type: 'bool',
                description: 'True to focus the control on render.'},
            {name: 'selectOnFocus', value: false, type: 'bool',
                description: 'True to select contents when control receives focus.'},
            {name: 'commitOnChange', value: false, type: 'bool',
                description: 'True to commit on every change/keystroke.'},
            {name: 'spellCheck', value: true, type: 'bool',
                description: 'True to allow browser spell check.'},
            {name: 'placeholder', value: undefined, type: 'text',
                description: 'Text to display when control is empty.'}
        ],
        description: [
            p('A multi-line text input.')
        ]
    });
}