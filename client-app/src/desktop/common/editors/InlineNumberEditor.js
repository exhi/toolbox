import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {Ref} from '@xh/hoist/utils/react';
import {numberInput} from '@xh/hoist/desktop/cmp/input';

@HoistComponent
export class InlineNumberEditor extends Component {

    @bindable value;
    inputRef = new Ref();

    constructor(props) {
        super(props);
        this.value = props.value;

        this.addReaction({
            track: () => this.inputRef.value,
            run: (inputEl) => {
                const domInput = inputEl.getDOMNode().querySelector('input');
                domInput.focus();
            },
            delay: 1
        });
    }

    render() {
        return numberInput({
            bind: 'value',
            model: this,
            width: '100%',
            ref: this.inputRef.ref,
            commitOnChange: true,
            selectOnFocus: true
        });
    }

    getValue() {
        return this.value;
    }
}