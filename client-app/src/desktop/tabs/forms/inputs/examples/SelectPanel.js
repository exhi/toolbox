import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {select} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const SelectPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: select,
        fixedParams: {options: ['hello', 'world']},
        description: 'checkbox description.'
    });
}