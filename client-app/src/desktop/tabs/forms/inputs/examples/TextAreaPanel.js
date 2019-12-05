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
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'commitOnChange', value: false, type: 'bool'},
            {name: 'spellCheck', value: true, type: 'bool'},
            {name: 'placeholder', value: undefined, type: 'text'}
        ],
        description: [
            p('A multi-line text input.')
        ]
    });
}