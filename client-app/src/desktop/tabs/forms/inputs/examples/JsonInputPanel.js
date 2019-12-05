import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {jsonInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const JsonInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {

    return new InputTestModel({
        input: jsonInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'commitOnChange', value: false, type: 'bool'},
            {name: 'showActionButtons', value: true, type: 'bool'}
        ],
        description: 'jsoninput description.'
    });
}