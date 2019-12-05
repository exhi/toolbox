import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {select} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {usStates} from '../../../../../core/data';

export const SelectPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: select,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'enableClear', value: false, type: 'bool'},
            {name: 'enableFilter', value: false, type: 'bool'},
            {name: 'enableMulti', value: false, type: 'bool'},
            {name: 'hideSelectedOptionCheck', value: false, type: 'bool'},
            {name: 'menuPlacement', value: 'auto', type: 'select',
                options: ['auto', 'top', 'bottom']},
            {name: 'placeholder', value: undefined, type: 'text'}
        ],
        fixedParams: {
            options: usStates
        },
        description: 'checkbox description.'
    });
}