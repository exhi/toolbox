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
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'inline', value: false, type: 'bool'},
            {name: 'labelAlign', value: 'left', type: 'select',
                options: ['left', 'right']}
        ],
        fixedParams: {options: ['lemon', 'lime', 'orange', 'grapefruit']},
        description: 'radio input description.'
    });
}