import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {radioInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const RadioInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: radioInput,
        fixedParams: {options: ['hello', 'world']},
        description: 'radio input description.'
    });
}