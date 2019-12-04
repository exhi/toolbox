import {HoistModel} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';

@HoistModel
export class InputTestModel {

    input;

    @bindable.ref
    userParams;

    fixedParams;

    @bindable
    value = null;

    description;

    fmtVal;

    constructor({input, userParams = [], fixedParams, description, value, fmtVal}) {
        this.input = input;
        this.userParams = userParams;
        this.fixedParams = fixedParams;
        this.description = description;
        this.value = value;
        this.fmtVal = fmtVal;
    }
}