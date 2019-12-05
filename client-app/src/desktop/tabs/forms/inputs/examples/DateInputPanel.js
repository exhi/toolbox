import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {dateInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {fmtDateTime} from '@xh/hoist/format';
import {p} from '@xh/hoist/cmp/layout';

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
        description: [
            p('A Calendar Control for choosing a Date.'),
            p('By default this control emits dates with the time component cleared (set to midnight), but this' +
            'can be customized via the timePrecision prop to support editing of a date and time together.'),
            p('The calendar popover can be opened via the built-in button or up/down arrow keyboard shortcuts.')
        ],
        fmtVal: fmtDateTime
    });
}