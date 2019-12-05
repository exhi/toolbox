import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {buttonGroupInput} from '@xh/hoist/desktop/cmp/input';

export const ButtonGroupInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: buttonGroupInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'}
        ],
        description: 'description for thing'
    });
}