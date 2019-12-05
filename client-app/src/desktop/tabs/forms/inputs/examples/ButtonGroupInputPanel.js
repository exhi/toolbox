import {hoistCmp, useLocalModel} from '@xh/hoist/core';
import {InputTestModel} from '../InputTestModel';
import {inputTestPanel} from '../InputTestPanel';
import {buttonGroupInput} from '@xh/hoist/desktop/cmp/input';
import {button} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon/Icon';

export const ButtonGroupInputPanel = hoistCmp({

    render() {
        const model = useLocalModel(createModel);
        return inputTestPanel({model});
    }
});

function createModel() {

    return new InputTestModel({
        input: buttonGroupInput,
        fixedParams: {
            items: [
                button({
                    text: 'Button 1',
                    value: 'button1'
                }),
                button({
                    text: 'Button 2',
                    value: 'button2'
                }),
                button({
                    text: 'Button 3',
                    value: 'button3'
                }),
                button({
                    icon: Icon.thumbsUp(),
                    value: 'good'
                }),
                button({
                    icon: Icon.thumbsDown(),
                    value: 'bad'
                }),
                button({
                    icon: Icon.skull(),
                    value: 'very bad'
                })
            ]
        },
        userParams: [
            {name: 'disabled', value: false, type: 'bool'},
            {name: 'minimal', value: false, type: 'bool'},
            {name: 'vertical', value: false, type: 'bool'},
            {name: 'enableClear', value: true, type: 'bool'}
        ],
        description: 'description for thing'
    });
}