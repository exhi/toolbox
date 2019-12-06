import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {numberInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {li, p, ul} from '@xh/hoist/cmp/layout';

export const NumberInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {

    return new InputTestModel({
        input: numberInput,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            {name: 'autoFocus', value: true, type: 'bool',
                description: 'True to focus the control on render.'},
            {name: 'selectOnFocus', value: false, type: 'bool',
                description: 'True to select contents when control receives focus.'},
            {name: 'commitOnChange', value: false, type: 'bool',
                description: 'True to commit on every change/keystroke'},
            {name: 'displayWithCommas', value: false, type: 'bool',
                description: 'True to insert commas in displayed value.'},
            {name: 'enableShorthandUnits', value: false, type: 'bool',
                description: 'True to convert entries suffixed with k/m/b to thousands/millions/billions.'},
            {name: 'precision', value: undefined, type: 'number',
                description: 'Max decimal precision of the value, defaults to 4.'},
            {name: 'placeholder', value: undefined, type: 'text',
                description: 'Text to display when control is empty.'},
            {name: 'zeroPad', value: false, type: 'bool',
                description: 'True to pad with trailing zeros out to precision, default false.'},
            {name: 'stepSize', value: 1, type: 'number',
                description: 'Standard step size for increment/decrement handling.'},
            {name: 'majorStepSize', value: 10, type: 'number',
                description: 'Major step size for increment/decrement handling.'},
            {name: 'minorStepSize', value: 0.1, type: 'number',
                description: 'Minor step size for increment/decrement handling.'},
            {name: 'min', value: undefined, type: 'number',
                description: 'Minimum value for increment/decrememnt.'},
            {name: 'max', value: undefined, type: 'number',
                description: 'Maximum value for increment/decrememnt.'}
            // TODO: figure out why these icons don't display
            /*  {name: 'leftIcon', value: null, type: 'select',
                options: [
                    null,
                    {label: '$', value: Icon.dollarSign()},
                    {label: 'gears', value: Icon.gears()}
                ],
                description: 'Icon to display inline on the left side of the input.'}*/
        ],
        description: [
            p('Number input, with optional support for formatted of display value, shorthand units, and more.'),
            p('This component is built on the Blueprint NumericInput and gets default increment/decrement' +
                'functionality from that component, based on the three stepSize props.'),
            p('This Hoist component hides the up/down buttons by default but keeps the keyboard handling'),
            p('Users can use the following keys to increment/decrement:'),
            ul(
                li('↑/↓           by one step'),
                li('Shift + ↑/↓   by one major step'),
                li('Alt + ↑/↓     by one minor step')
            ),
            p('Set the corresponding stepSize prop(s) to null to disable this feature.')
        ]
    });
}