import {useLocalModel} from '@xh/hoist/core/hooks';
import {InputTestModel} from '../InputTestModel';
import {PropTypes as T} from 'react-view';
import {TextInput} from '@xh/hoist/desktop/cmp/input';
import {hoistCmp} from '@xh/hoist/core';
import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

export const textInputPanel = hoistCmp.factory({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {
    return new InputTestModel({
        description:
            [
                p('A single-line text input with additional support for embedded icons/elements.')
            ],
        componentName: 'TextInput',
        props: {
            autoComplete: {
                value: 'nope',
                type: T.String,
                description:
                    'HTML `autocomplete` attribute to set on underlying <input> element. \n' +
                    'Defaults to non-valid value \'nope\' for fields of type text and \'new-password\' for fields ' +
                    'of type \'password\' to defeat browser auto-completion, which is typically not desired in ' +
                    'Hoist applications. Set to \'on\' or a more specific autocomplete token to enable. ',
                hidden: true
            },
            autoFocus: {
                value: false,
                type: T.Boolean,
                description: 'True to focus the control on render.',
                hidden: true
            },
            commitOnChange: {
                value: false,
                type: T.Boolean,
                description: 'True to commit on every change/keystroke, default false.'
            },
            enableClear: {
                value: false,
                type: T.Boolean,
                description: 'True to show a "clear" button as the right element. default false.'
            },
            leftIcon: {
                value: null,
                type: T.ReactNode,
                description: 'Icon to display inline on the left side of the input.'
            },
            onKeyDown: {
                value: null,
                type: T.Function,
                description: 'Callback for normalized keydown event.',
                hidden: true
            },
            placeholder: {
                value: null,
                type: T.String,
                description: 'Text to display when control is empty.'
            },
            rightElement: {
                value: null,
                type: T.ReactNode,
                description: 'Element to display inline on the right side of the input.',
                hidden: true
            },
            round: {
                value: false,
                type: T.Boolean,
                description: 'True to display with rounded caps.'
            },
            selectOnFocus: {
                value: false,
                type: T.Boolean,
                description: 'True to select contents when control receives focus.'
            },
            textAlign: {
                value: 'left',
                type: T.Enum,
                enumName: 'alignments',
                options: alignments,
                description: 'Alignment of entry text within control, default \'left\'.'
            },
            spellCheck: {
                value: false,
                type: T.Boolean,
                description: 'True to allow browser spell check, default false.'
            },
            type: {
                value: 'text',
                type: T.Enum,
                enumName: 'elementTypes',
                options: elementTypes,
                description: 'Underlying HTML <input> element type.'
            }
        },
        scope: {
            TextInput,
            alignments,
            elementTypes
        }
    });
}

const elementTypes = {
    text: 'text',
    password: 'password'
};

const alignments = {
    left: 'left',
    right: 'right'
};
