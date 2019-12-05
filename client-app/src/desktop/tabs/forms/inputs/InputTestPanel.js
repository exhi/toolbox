import {hoistCmp, uses} from '@xh/hoist/core';
import {switchInput, select, textInput, numberInput} from '@xh/hoist/desktop/cmp/input';
import {hbox, span, vbox} from '@xh/hoist/cmp/layout';
import {InputTestModel} from './InputTestModel';
import {wrapper} from '../../../common';

import './InputTestPanel.scss';

export const inputTestPanel = hoistCmp.factory({

    model: uses(InputTestModel),

    render({model}) {
        return wrapper({
            description: model.description,
            item: hbox(
                vbox({
                    className: 'input-test-panel-input',
                    items: [
                        span({
                            className: 'input-test-panel-input_value',
                            item: displayValue(model.fmtVal, model.value)
                        }),
                        span({
                            className: 'input-test-panel-input_input',
                            /*
                             * Find out why JsonInput can't get the model from context!
                             * I shouldn't have to pass in a model here.
                             */
                            item: model.input({model, bind: 'value', ...model.fixedParams, ...getParams(model.userParams)})
                        })
                    ]
                }),
                controls()
            )
        });
    }
});

const controls = hoistCmp.factory({

    render({model}) {

        return vbox({
            items: model.userParams.map(param => {
                const {value, description, options, type, name} = param,
                    onCommit = (newValue) => setValue(model, param, newValue);

                let control = (() => {
                    switch (type) {
                        case 'bool':
                            return switchInput({value, onCommit});
                        case 'text':
                            return textInput({value, onCommit, textAlign: 'right', placeholder: 'text'});
                        case 'select':
                            return select({value, onCommit, options});
                        case 'number':
                            return numberInput({value, onCommit, placeholder: 'number'});
                    }
                })();

                return hbox({
                    title: description,
                    className: 'input-test-panel-param',
                    items: [
                        span({className: 'input-test-panel-param_display', item: name}),
                        span({className: 'input-test-panel-param_control', item: control})
                    ]
                });
            })
        });
    }
});

function displayValue(fmtVal, value) {
    let res = fmtVal ? fmtVal(value) : String(value);
    if (value == null) {
        res = 'null';
    } else {
        if (res.trim() === '') {
            res = res.length ? '[Blank String]' : '[Empty String]';
        }
    }

    return res;
}

function setValue(model, param, newValue) {
    param.value = newValue;
    model.setUserParams([...model.userParams]);
}

function getParams(params) {
    const ret = {};
    params.forEach(param => ret[param.name] = param.value);
    return ret;
}