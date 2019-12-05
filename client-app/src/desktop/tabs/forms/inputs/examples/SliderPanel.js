import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {slider} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {vbox} from '@xh/hoist/cmp/layout';

export const SliderPanel = hoistCmp({

    render() {
        const oneHandleSliderModel = useLocalModel(createOneHandleSliderModel);
        const twoHandleSliderModel = useLocalModel(createTwoHandleSliderModel);
        return vbox({
            items: [
                inputTestPanel({model: oneHandleSliderModel}),
                inputTestPanel({model: twoHandleSliderModel})
            ]
        });
    }
});

function createSliderModel(value) {
    return new InputTestModel({
        input: slider,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'min', value: 0, type: 'number'},
            {name: 'max', value: 5, type: 'number'},
            {name: 'labelStepSize', value: 1, type: 'number'},
            {name: 'stepSize', value: 1, type: 'number'},
            {name: 'showTrackFill', value: true, type: 'bool'}
        ],
        description: 'slider description.',
        value: value
    });
}

function createOneHandleSliderModel() {
    return createSliderModel(0);
}

function createTwoHandleSliderModel() {
    return createSliderModel([0, 2]);
}