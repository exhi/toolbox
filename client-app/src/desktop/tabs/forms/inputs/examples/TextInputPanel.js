import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {textInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

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
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'commitOnChange', value: false, type: 'bool'},
            {name: 'enableClear', value: false, type: 'bool'},
            {name: 'round', value: false, type: 'bool'},
            {name: 'spellCheck', value: true, type: 'bool'},
            {name: 'placeholder', value: undefined, type: 'text'}
        ],
        description: 'textinput description.'
    });
}