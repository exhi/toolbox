import React from 'react';
import {clone, toLower} from 'lodash';

import {HoistModel} from '@xh/hoist/core';
import {action, bindable, computed, observable} from '@xh/hoist/mobx';
import * as formatNumber from '@xh/hoist/format/FormatNumber';

@HoistModel
export class FormatsTabModel {

    @bindable testNumbers = [
        '-1842343',
        '1.23456e-12',
        '0.25',
        '1.224123',
        '50',
        '101',
        '12456.12',
        '123400.1',
        '123450',
        '123456',
        '920120.21343',
        '12345600',
        '12345000',
        '100000001',
        '123450000',
        '123456789.12',
        '1234567890.12',
        '1.23456e14'
    ];

    @bindable presetFunction = 'fmtThousands';
    @observable singleOptionsDisabled = true;

    @bindable precisionAuto = false;
    @bindable precisionNumber = 2;
    @computed get precision() {
        return this.precisionAuto ? 'auto' : this.precisionNumber;
    }

    @bindable zeroPad = true;
    @bindable ledger = true;
    @bindable forceLedgerAlign = true;
    @bindable withPlusSign = false;
    @bindable withSignGlyph = false;
    @bindable colorSpec = true;
    @bindable label = '';

    @bindable numberFromUser = '1000';

    @computed
    get fOptions() {
        return {
            asElement: true,
            units: toLower(this.units),
            precision: this.precision,
            zeroPad: this.zeroPad,
            ledger: this.ledger,
            forceLedgerAlign: this.forceLedgerAlign,
            withPlusSign: this.withPlusSign,
            withSignGlyph: this.withSignGlyph,
            colorSpec: this.colorSpec,
            label: this.label
        };
    }

    @computed
    get formattedNumbers() {
        const {testNumbers, presetFunction} = this,
            customFormatOptions = this.getFormatOptions(),
            rows = testNumbers.map(
                (num, index) =>
                    <tr key={`num-${index}`}>
                        <td className="indexColumn">{index + 1}.</td>
                        <td align="right" className="inputColumn">
                            {num}
                        </td>
                        <td align="right">
                            {formatNumber[presetFunction](Number(num), customFormatOptions)}
                        </td>
                    </tr>
            );

        return rows;
    }

    // handle user typing in scientific notation:
    // for example: 1.89e   - if not caught will cause numbro exception to be thrown
    @computed
    get formattedUserInput() {
        const {numberFromUser, presetFunction} = this;

        try {
            return formatNumber[presetFunction](Number(numberFromUser), this.getFormatOptions());
        } catch (e) {
            return '';
        }
    }

    //-----------------------------
    // Implementation
    //-----------------------------
    @action
    handlePresetFunctionChange(val) {
        this.singleOptionsDisabled = val != 'fmtNumber';
    }


    getFormatOptions() {
        const {presetFunction, fOptions} = this;
        return presetFunction == 'fmtNumber' ?
            clone(fOptions) :
            {
                asElement: true
            };
    }

}