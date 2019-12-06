import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {dateInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {fmtDateTime} from '@xh/hoist/format';
import {p} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon/Icon';

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
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'enablePicker', value: true, type: 'bool',
                description: 'Enable using the DatePicker popover.'},
            {name: 'enableTextInput', value: true, type: 'bool',
                description: 'Enable using the text control to enter date as text.'},
            {name: 'enableClear', value: false, type: 'bool',
                description: 'True to show a "clear" button aligned to the right of the control.'},
            {name: 'formatString', value: 'YYYY-MM-DD HH:mm:ss', type: 'text',
                description: 'MomentJS format string for date display and parsing. Defaults to `YYYY-MM-DD HH:mm:ss`' +
                    'with default presence of time components determined by the timePrecision prop.'},
            {name: 'placeholder', value: undefined, type: 'text',
                description: 'Text to display when control is empty.'},
            {name: 'popoverPosition', value: 'auto', type: 'select',
                options: [
                    'top-left', 'top', 'top-right',
                    'right-top', 'right', 'right-bottom',
                    'bottom-right', 'bottom', 'bottom-left',
                    'left-bottom', 'left', 'left-top',
                    'auto'
                ],
                description: 'Position for calendar popover, as per Blueprint docs.'},
            {name: 'showActionsBar', value: false, type: 'bool',
                description: 'True to show a bar with Today + Clear buttons at bottom of date picker popover.'},
            {name: 'strictInputParsing', value: false, type: 'bool',
                description: [
                    'True to parse any dates entered via the text input with moment\'s "strict" mode enabled.' +
                    'This ensures that the input entry matches the format specified by `formatString` exactly.' +
                    'If it does not, the input will be considered invalid and the value set to `null`.' +
                    'See https://momentjs.com/guides/#/parsing/strict-mode/'
                ]},
            {name: 'textAlign', value: 'left', type: 'select',
                options: ['left', 'right'],
                description: 'Alignment of entry text within control'},
            {name: 'timePrecision', value: undefined, type: 'select',
                options: [undefined, 'second', 'minute'],
                description:
                    'The precision of time selection that accompanies the calendar.' +
                    'If undefined, control will not show time. Ignored when valueType is localDate.'},
            {name: 'leftIcon', value: null, type: 'select',
                options: [
                    null,
                    {label: 'envelope', value: Icon.envelope()},
                    {label: 'clock', value: Icon.clock()}
                ],
                description: 'Icon to display inline on the left side of the input.'}
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