import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {switchInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const SwitchInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: switchInput,
        description: 'switchinput description.'
    });
}