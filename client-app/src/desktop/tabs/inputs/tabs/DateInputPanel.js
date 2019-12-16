import {useLocalModel} from '@xh/hoist/core/hooks';
import {InputTestModel} from '../InputTestModel';
import {PropTypes as T} from 'react-view';
import {DateInput} from '@xh/hoist/desktop/cmp/input';
import {Icon} from '@xh/hoist/icon';
import {hoistCmp} from '@xh/hoist/core';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

export const DateInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {
    return new InputTestModel({
        description:
            [
                p('A Calendar Control for choosing a Date.'),
                p('By default this control emits dates with the time component cleared (set to midnight), but this ' +
                    'can be customized via the timePrecision prop to support editing of a date and time together.'),
                p('The calendar popover can be opened via the built-in button or up/down arrow keyboard shortcuts.')
            ],
        componentName: 'DateInput',
        props: {
            dayPickerProps: {
                value: null,
                type: T.Object,
                description: 'Props passed to ReactDayPicker component, as per DayPicker docs. '
            },
            enablePicker: {
                value: true,
                type: T.Boolean,
                description: 'Enable using the DatePicker popover. '
            },
            enableTextInput: {
                value: true,
                type: T.Boolean,
                description: 'Enable using the text control to enter date as text. '
            },
            enableClear: {
                value: true,
                type: T.Boolean,
                description: 'True to show a "clear" button aligned to the right of the control. '
            },
            formatString: {
                value: 'YYYY-MM-DD HH:mm:ss',
                type: T.String,
                description:
                    'MomentJS format string for date display and parsing. Defaults to `YYYY-MM-DD HH:mm:ss` ' +
                    'with default presence of time components determined by the timePrecision prop. '
            },
            initialMonth: {
                value: new Date(),
                type: T.Date,
                description:
                    'Month to display in calendar popover on first render. ' +
                    'If unspecified, BP\'s component will default to the month of the current value (if present), or today ' +
                    '(if within min/max), or to the mid-point between min/max. Note that falling through to ' +
                    'that last case can result in an unexpectedly far-future default! '
            },
            leftIcon: {
                value: null,
                type: T.ReactNode,
                description: 'Icon to display inline on the left side of the input. '
            },
            rightElement: {
                value: null,
                type: T.ReactNode,
                description:
                    'Element to display inline on the right side of the input. Note if provided, this will ' +
                    'take the place of the (default) calendar-picker button and (optional) clear button. '
            },
            maxDate: {
                value: null,
                type: T.Date,
                description:
                    'Maximum (inclusive) valid date. Controls which dates can be selected via the calendar ' +
                    'picker. Will reset any out-of-bounds manually entered input to `null`. ' +
                    'Note this is distinct in these ways from FormModel based validation, which will leave an ' +
                    'invalid date entry in place but flag as invalid via FormField. For cases where it is ' +
                    'possible to use FormField, that is often a better choice. '
            },
            minDate: {
                value: null,
                type: T.Date,
                description:
                    'Minimum (inclusive) valid date. Controls which dates can be selected via the calendar ' +
                    'picker. Will reset any out-of-bounds manually entered input to `null`. \n' +
                    'See note re. validation on maxDate, above.'
            },
            placeholder: {
                value: null,
                type: T.String,
                description: 'Text to display when control is empty. '
            },
            // TODO: see if I can sort this thing out
            popoverPosition: {
                value: null,
                type: T.String,
                description: 'Position for calendar popover, as per Blueprint docs. Options are: \n' +
                    'top-left\n' +
                    'top\n' +
                    'top-right\n' +
                    'right-top\n' +
                    'right\n' +
                    'right-bottom\n' +
                    'bottom-right\n'  +
                    'bottom\n'  +
                    'bottom-left\n' +
                    'left-bottom\n' +
                    'left\n' +
                    'left-top\n' +
                    'auto'
            },
            showActionsBar: {
                value: true,
                type: T.Boolean,
                description: 'True to show a bar with Today + Clear buttons at bottom of date picker popover. '
            },
            showPickerOnFocus: {
                value: true,
                type: T.Boolean,
                description: 'True to show the picker upon focusing the input. '
            },
            strictInputParsing: {
                value: false,
                type: T.Boolean,
                description:
                    'True to parse any dates entered via the text input with moment\'s "strict" mode enabled. \n' +
                    'This ensures that the input entry matches the format specified by `formatString` exactly. \n' +
                    'If it does not, the input will be considered invalid and the value set to `null`. '
            },
            textAlign: {
                value:  'alignments.left',
                type: T.Enum,
                enumName: 'alignments',
                options: alignments,
                description: 'Alignment of entry text within control, default \'left\'. '
            },
            timePickerProps: {
                value: null,
                type: T.Object,
                description: 'Props passed to the TimePicker, as per Blueprint docs. '
            },
            timePrecision: {
                value: 'precisions.null',
                type: T.Enum,
                enumName: 'precisions',
                options: precisions,
                description:
                    'The precision of time selection that accompanies the calendar.\n' +
                    'If undefined, control will not show time. Ignored when valueType is localDate. '
            },
            valueType: {
                value: 'dateTypes.date',
                type: T.Enum,
                enumName: 'dateTypes',
                options: dateTypes,
                description: 'Type of value to publish. Defaults to \'date\'. '
            },
            selectOnFocus: {
                value: false,
                type: T.Boolean,
                description: 'True to select contents when control receives focus. '
            }
        },
        scope: {
            DateInput,
            Icon,
            alignments,
            precisions,
            dateTypes
        }
    });
}

const alignments = {
    left: 'left',
    right: 'right'
};

const precisions = {
    null: null,
    second: 'second',
    minute: 'minute'
};

const dateTypes = {
    date: 'date',
    localDate: 'localDate'
};