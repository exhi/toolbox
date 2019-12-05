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
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'commitOnChange', value: false, type: 'bool'},
            {name: 'displayWithCommas', value: false, type: 'bool'},
            {name: 'enableShorthandUnits', value: false, type: 'bool'},
            {name: 'precision', value: undefined, type: 'number'},
            {name: 'selectOnFocus', value: true, type: 'bool', description: 'Toggle selecting all text when input selected'},
            {name: 'placeholder', value: undefined, type: 'text'},
            {name: 'zeroPad', value: false, type: 'bool'}
        ],
        description: 'An input to for numbers.'
    });
}