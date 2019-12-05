import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {switchInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

export const SwitchInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: switchInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'label', value: undefined, type: 'text'},
            {name: 'labelAlign', value: 'left', type: 'select',
                options: ['left', 'right']}
        ],
        description: [
            p('Switch (toggle) control for non-nullable boolean values.')
        ],
        value: false
    });
}