import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {checkbox} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const CheckboxPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: checkbox,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'label', value: null, type: 'text'},
            {name: 'displayUnsetState', value: true, type: 'bool'},
            {name: 'labelAlign', value: 'left', type: 'select',
                options: ['left', 'right']}
        ],
        description: 'checkbox description.'
    });
}