import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {radioInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

export const RadioInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {

    return new InputTestModel({
        input: radioInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'inline', value: false, type: 'bool',
                description: 'True to display each radio button inline with each other.'},
            {name: 'labelAlign', value: 'left', type: 'select',
                options: ['left', 'right'],
                description: 'Alignment of each option\'s label relative its radio button, default right.'}
        ],
        fixedParams: {options: ['lemon', 'lime', 'orange', 'grapefruit']},
        description: [
            p('An input for managing Radio Buttons.')
        ]
    });
}