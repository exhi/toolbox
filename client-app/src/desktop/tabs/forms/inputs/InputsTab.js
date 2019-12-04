import {tabContainer} from '@xh/hoist/cmp/tab';
import {hoistCmp} from '@xh/hoist/core';
import {TextAreaPanel} from './examples/TextAreaPanel';
import {NumberInputPanel} from './examples/NumberInputPanel';
import {ButtonGroupInputPanel} from './examples/ButtonGroupInputPanel';
import {CheckboxPanel} from './examples/CheckboxPanel';
import {DateInputPanel} from './examples/DateInputPanel';
import {JsonInputPanel} from './examples/JsonInputPanel';
import {RadioInputPanel} from './examples/RadioInputPanel';
import {SelectPanel} from './examples/SelectPanel';
import {SliderPanel} from './examples/SliderPanel';
import {SwitchInputPanel} from './examples/SwitchInputPanel';
import {TextInputPanel} from './examples/TextInputPanel';

export const InputsTab = hoistCmp(
    () => tabContainer({
        model: {
            route: 'default.forms.inputs',
            switcherPosition: 'left',
            tabs: [
                {id: 'buttonGroupInput', title: 'ButtonGroupInput', content: ButtonGroupInputPanel},
                {id: 'checkbox', title: 'Checkbox', content: CheckboxPanel},
                {id: 'dateInput', title: 'DateInput', content: DateInputPanel},
                {id: 'jsonInput', title: 'JsonInput', content: JsonInputPanel},
                {id: 'numberInput', title: 'NumberInput', content: NumberInputPanel},
                {id: 'radioInput', title: 'RadioInput', content: RadioInputPanel},
                {id: 'select', title: 'Select', content: SelectPanel},
                {id: 'slider', title: 'Slider', content: SliderPanel},
                {id: 'switchInput', title: 'SwitchInput', content: SwitchInputPanel},
                {id: 'textArea', title: 'TextArea', content: TextAreaPanel},
                {id: 'textInput', title: 'TextInput', content: TextInputPanel}
            ]
        },
        className: 'toolbox-tab'
    })
);