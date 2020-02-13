import {useLocalModel} from '@xh/hoist/core/hooks';
import {InputTestModel} from '../InputTestModel';
import {PropTypes as T} from 'react-view';
import {RadioInput} from '@xh/hoist/desktop/cmp/input';
import {hoistCmp} from '@xh/hoist/core';
import template from '@babel/template';

import {inputTestPanel} from '../InputTestPanel';
import {p} from '@xh/hoist/cmp/layout';

export const radioInputPanel = hoistCmp.factory({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {
    return new InputTestModel({
        description:
            [
                p('An input for managing Radio Buttons.')
            ],
        componentName: 'RadioInput',
        customProps: {
            options: {
                generate: () => {
                    return (template.ast(options, {plugins: ['jsx']}))
                        .expression;
                },
                parse: (code) => {}
            }
        },
        props: {
            inline: {
                value: true,
                type: T.Boolean,
                description: 'True to display each radio button inline with each other.'
            },
            labelAlign: {
                value: 'right',
                type: T.Enum,
                enumName: 'alignments',
                options: alignments,
                description: 'Alignment of each option\'s label relative its radio button, default right.'
            },
            options: {
                value: options,
                type: T.Object,
                description:
                    'Array of available options, of the form:\n' +
                    '      [{value: string, label: string, disabled: bool}, ...]\n' +
                    '         - or -\n' +
                    '      [val, val, ...]\n'
            }
        },
        scope: {
            RadioInput,
            alignments
        }
    });
}

const options =
    "['Steak', 'Chicken', {label: 'Fish', value: 'Fish', disabled: true}]";

const alignments = {
    left: 'left',
    right: 'right'
};