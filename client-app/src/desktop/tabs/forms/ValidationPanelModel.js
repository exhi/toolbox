import {HoistModel} from '@xh/hoist/core';
import {FieldSupport, field, required, dateIs, lengthIs, numberIs} from '@xh/hoist/field';
import {wait} from '@xh/hoist/promise';
import {isNil} from 'lodash';
import moment from 'moment';

@HoistModel()
@FieldSupport
export class ValidationPanelModel {

    // TextField / TextArea
    @field(required, lengthIs({max: 5}))
    firstName;

    @field(required, lengthIs({max: 20}))
    lastName;

    @field(required,
        ({value}) => {
            if (isNil(value)) return;
            return wait(100).then(() => {
                if ((!value.includes('@') || !value.includes('.'))) {
                    return 'Backend says this is not a valid email';
                }
            });
        }
    )
    email;

    @field(required, numberIs({min: 10}))
    yearsExperience;

    @field('Hire Date', required, dateIs({min: moment().startOf('day').toDate()}))
    startDate;

    @field('Termination Date')
    endDate;

    constructor() {
        window.sniff = this;
        this.getField('endDate').addRules({
            when: ({value}, {startDate}) => startDate && value,
            check: ({value, displayName}, {startDate}) => value < startDate ? `${displayName} must be after Start Date` : null
        });

        this.initFields({});

    }
}