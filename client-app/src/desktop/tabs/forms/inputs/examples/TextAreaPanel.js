import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {textArea} from '@xh/hoist/desktop/cmp/input';

export const TextAreaPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: textArea,
        description: 'description for thing'
    });
}