import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {dateInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {fmtDateTime} from '@xh/hoist/format';

export const DateInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {

    return new InputTestModel({
        input: dateInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'enablePicker', value: true, type: 'bool'},
            {name: 'enableTextInput', value: false, type: 'bool'},
            {name: 'enableClear', value: false, type: 'bool'},
            {name: 'formatString', value: 'YYYY-MM-DD HH:mm:ss', type: 'text'},
            {name: 'placeholder', value: undefined, type: 'text'},
            {name: 'popoverPosition', value: 'auto', type: 'select',
                options: [
                    'top-left', 'top', 'top-right',
                    'right-top', 'right', 'right-bottom',
                    'bottom-right', 'bottom', 'bottom-left',
                    'left-bottom', 'left', 'left-top',
                    'auto'
                ]
            },
            {name: 'showActionsBar', value: false, type: 'bool'},
            {name: 'strictInputParsing', value: false, type: 'bool'},
            {name: 'textAlign', value: 'left', type: 'select',
                options: ['left', 'right']},
            {name: 'timePrecision', value: undefined, type: 'select',
                options: [undefined, 'second', 'minute']}
        ],
        description: 'dateInput description.',
        fmtVal: fmtDateTime
    });
}