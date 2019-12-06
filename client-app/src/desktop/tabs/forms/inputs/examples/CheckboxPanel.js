import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {checkbox} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

export const CheckboxPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});


function createModel() {

    return new InputTestModel({
        input: checkbox,
        userParams: [
            {name: 'disabled', value: false, type: 'bool',
                description: 'True to disable user interaction.'},
            // TODO: decide whether or not autofocus is sensible to have.
            {name: 'autoFocus', value: true, type: 'bool',
                description: 'True to focus the control on render.'},
            {name: 'label', value: null, type: 'text',
                description: 'Label text displayed adjacent to the control itself.'},
            {name: 'displayUnsetState', value: true, type: 'bool',
                description: 'True to render null or undefined as a distinct visual state.  If false,' +
                              'these values will appear unchecked and visually indistinct from false.'},
            {name: 'labelAlign', value: 'right', type: 'select',
                options: ['left', 'right'],
                description: 'Alignment of the inline label relative to the control itself, default right.'}
        ],
        description: [
            p('Checkbox control for boolean values.'),
            p('Renders null with an "indeterminate" [-] display.')
        ]
    });
}