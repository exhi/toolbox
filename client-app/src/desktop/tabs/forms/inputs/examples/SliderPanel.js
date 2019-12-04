import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {slider} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';

export const SliderPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: slider,
        userParams: [
            {name: 'min', value: 0, type: 'number'},
            {name: 'max', value: 5, type: 'number'},
            {name: 'labelStepSize', value: 1, type: 'number'}
        ],
        description: 'slider description.',
        value: 0
    });
}