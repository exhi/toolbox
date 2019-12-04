import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {numberInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const NumberInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: numberInput,
        userParams: [
            {name: 'disabled', type: 'bool'},
            {name: 'displayWithCommas', type: 'bool'},
            {name: 'enableShorthandUnits', type: 'bool'},
            {name: 'precision', type: 'number'},
            {name: 'selectOnFocus', type: 'bool', description: 'Toggle selecting all text when input selected'},
            {name: 'placeholder', type: 'text'}
        ],
        description: 'An input to for numbers.'
    });
}