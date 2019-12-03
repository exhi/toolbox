import {wrapper} from '../../../common';
import React from 'react';
import {hoistCmp} from '@xh/hoist/core';
import {form, FormModel} from '@xh/hoist/cmp/form';
import {useLocalModel} from '@xh/hoist/core/hooks';
import {switchInput, textArea} from '@xh/hoist/desktop/cmp/input';
import {formField} from '@xh/hoist/desktop/cmp/form';
import {box, div, vbox} from '@xh/hoist/cmp/layout';

export const [InputTestPanel, inputTestPanel] = hoistCmp.withFactory({

    render({options=[]}) {

        const model = useLocalModel(() => new FormModel({
            fields: [...options.map(option => {return {name: option}}), {name: 'field'}]
        }));

        return wrapper({
            description: [
                <p>
                    <code>HoistInput</code>s are core Components used to display editable data in applications.
                    They present a consistent API for editing data with MobX, React, and the underlying widgets
                    provided by libraries such as Blueprint and Onsen. At its simplest, any HoistInput can be bound to a
                    data source using the <code>bind</code> and <code>model</code> props.
                </p>,
                <p>
                    For more complex uses <code>HoistInput</code>s may also be hosted in <code>Form</code>s. Forms
                    provide
                    support for validation, data submission, and dirty state management.
                </p>
            ],
            links: [
                {url: '$TB/client-app/src/desktop/tabs/forms/InputsPanel.js', notes: 'This example.'},
                {url: '$HR/cmp/input/HoistInput.js', notes: 'HoistInput Base Class'},
                {url: '$HR/desktop/cmp/input', notes: 'Hoist Inputs'}
            ],
            item:
                box({
                    items: [
                        fieldDisplay({
                            fieldModel: model.fields['field']
                        }),
                        form({
                            model: model,
                            items: [
                                formField({
                                    field: 'field',
                                    item: textArea({
                                        selectOnFocus: model.fields['selectOnFocus'].value
                                    })
                                }),
                                optionsBox(options)
                            ]
                        })
                    ]
                })
        });
    }
});

const optionsBox = function(options) {
    return vbox({
        items:
            options.map(option =>
                formField({
                    field: option,
                    item: switchInput({
                        inline: false,
                        label: option
                    })
                })
            )
    });
};

const fieldDisplay = hoistCmp.factory(
    ({fieldModel, fmtVal}) => {
        let displayVal = fieldModel.value;
        if (displayVal == null) {
            displayVal = 'null';
        } else {
            displayVal = fmtVal ? fmtVal(displayVal) : displayVal.toString();
            if (displayVal.trim() === '') {
                displayVal = displayVal.length ? '[Blank String]' : '[Empty String]';
            }
        }
        return div({
            className: 'inputs-panel-field-display',
            item: displayVal
        });
    }
);