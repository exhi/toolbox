import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {dateInput} from '@xh/hoist/desktop/cmp/input';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {fmtDateTime} from '@xh/hoist/format';

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
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'enablePicker', value: true, type: 'bool'},
            {name: 'enableTextInput', value: false, type: 'bool'},
            {name: 'enableClear', value: false, type: 'bool'},
            {name: 'formatString', value: 'YYYY-MM-DD HH:mm:ss', type: 'text'},
            {name: 'timePrecision', value: undefined, type: 'select',
                options: [undefined, 'second', 'minute']}
        ],
        description: 'dateInput description.',
        fmtVal: fmtDateTime
    });
}