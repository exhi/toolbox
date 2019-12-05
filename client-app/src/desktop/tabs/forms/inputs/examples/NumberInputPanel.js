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
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'commitOnChange', value: false, type: 'bool'},
            {name: 'displayWithCommas', value: false, type: 'bool'},
            {name: 'enableShorthandUnits', value: false, type: 'bool'},
            {name: 'precision', value: undefined, type: 'number'},
            {name: 'selectOnFocus', value: true, type: 'bool', description: 'Toggle selecting all text when input selected'},
            {name: 'placeholder', value: undefined, type: 'text'},
            {name: 'zeroPad', value: false, type: 'bool'},
            {name: 'stepSize', value: 1, type: 'number'},
            {name: 'majorStepSize', value: 10, type: 'number'},
            {name: 'minorStepSize', value: 0.1, type: 'number'}
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