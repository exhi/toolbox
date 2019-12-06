import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {jsonInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

// TODO: figure out what's going on with this thing! Why does it need an explicitly passed panel?
export const JsonInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {

    return new InputTestModel({
        input: jsonInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'commitOnChange', value: false, type: 'bool',
                description: 'True to commit on every change/keystroke.'},
            {name: 'showActionButtons', value: true, type: 'bool',
                description: 'True to show Fullscreen + Auto-format buttons at top-right of input.'}
        ],
        description: [
            p('Code-editor style input for editing and validating JSON, powered by CodeMirror.')
        ]
    });
}