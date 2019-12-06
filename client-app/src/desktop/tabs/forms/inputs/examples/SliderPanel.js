import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {slider} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {box, p} from '@xh/hoist/cmp/layout';

export const SliderPanel = hoistCmp({

    render() {
        const oneHandleSliderModel = useLocalModel(createOneHandleSliderModel);
        const twoHandleSliderModel = useLocalModel(createTwoHandleSliderModel);
        return box({
            items: [
                inputTestPanel({model: oneHandleSliderModel}),
                inputTestPanel({model: twoHandleSliderModel})
            ]
        });
    }
});

const userParams =
    [
        {name: 'disabled', value: false, type: 'bool',
            description: 'True to disable user interaction.'},
        {name: 'min', value: 0, type: 'number',
            description: 'Minimum value.'},
        {name: 'max', value: 5, type: 'number',
            description: 'Maximum value.'},
        {name: 'labelStepSize', value: 1, type: 'number',
            description: 'Increment between successive labels. Must be greater than zero.'},
        {name: 'stepSize', value: 1, type: 'number',
            description: 'Increment between values. Must be greater than zero.'},
        {name: 'showTrackFill', value: true, type: 'bool',
            description:
                'True to render a solid bar between min and current values (for simple slider) or between' +
                'handles (for range slider). Defaults to true.'}
    ];

function createOneHandleSliderModel() {
    return new InputTestModel({
        input: slider,
        userParams,
        description: [
            p('A slider input to edit a single number.')
        ],
        value: 0
    });
}

function createTwoHandleSliderModel() {
    return new InputTestModel({
        input: slider,
        userParams,
        description: [
            p('A slider input to edit an array of two numbers (for a range).')
        ],
        value: [0, 2]
    });
}