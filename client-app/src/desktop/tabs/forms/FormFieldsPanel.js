/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import React, {Component} from 'react';
import moment from 'moment';
import {HoistComponent, XH} from '@xh/hoist/core';
import {box, filler, hbox, hframe, vbox} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {button} from '@xh/hoist/desktop/cmp/button';
import {
    checkField,
    comboField,
    dayField,
    label,
    numberField,
    selectField,
    sliderField,
    switchField,
    textField
} from '@xh/hoist/desktop/cmp/form';
import {Icon} from '@xh/hoist/icon/Icon';
import {fmtDate} from '@xh/hoist/format';

import {FormFieldsPanelModel} from './FormFieldsPanelModel';
import {wrapper} from '../../common/Wrapper';
import './FormFieldsPanel.scss';

@HoistComponent()
export class FormFieldsPanel extends Component {
    localModel = new FormFieldsPanelModel();

    render() {
        return wrapper(
            panel({
                className: 'toolbox-formfields-panel',
                title: 'Form Fields',
                width: 620,
                item: this.renderExample(),
                bbar: toolbar(
                    filler(),
                    button({
                        text: 'Save',
                        icon: Icon.check({className: 'xh-green'}),
                        disabled: !this.model.isValid,
                        onClick: this.onFormSubmit
                    })
                )
            })
        );
    }

    renderExample() {
        return hframe({
            className: 'toolbox-example-container',
            items: [
                vbox({
                    flex: 2,
                    marginRight: 5,
                    items: [
                        this.getLoginInfo(),
                        this.getContactInfo()
                    ]
                }),
                this.getRawValueInfo()
            ]
        });
    }

    getLoginInfo() {
        const model = this.model;
        return panel({
            title: 'Credentials',
            item: vbox({
                className: 'xh-panel-body',
                items: [
                    hbox(
                        label(this.renderLabel('User: ')),
                        textField({model, field: 'user', placeholder: 'User ID'})
                    ),
                    hbox(
                        label(this.renderLabel('Password: ')),
                        textField({model, field: 'password', placeholder: 'Password', type: 'password'})
                    ),
                    hbox(
                        label(this.renderLabel('Verify: ')),
                        textField({model, field: 'verify', placeholder: 'Password', type: 'password'})
                    ),
                    vbox(
                        label(this.renderLabel('Profile Completion: ')),
                        sliderField({model,
                            field: 'profileCompletion',
                            min: 0,
                            max: 100,
                            labelStepSize: 25,
                            stepSize: 1,
                            labelRenderer: val => `${val}%`
                        })
                    )
                ]
            })
        });
    }

    getContactInfo() {
        const model = this.model,
            {red, green, blue, movies, profileColor, usStates} = this.model;

        return panel({
            title: 'User Info',
            item: vbox({
                className: 'xh-panel-body',
                items: [
                    hbox(
                        label(this.renderLabel('Profile Color: ')),
                        numberField({
                            model,
                            field: 'red',
                            width: 50,
                            value: red,
                            min: 0,
                            max: 255,
                            commitOnChange: true
                        }),
                        numberField({
                            model,
                            field: 'green',
                            width: 50,
                            value: green,
                            min: 0,
                            max: 255,
                            commitOnChange: true
                        }),
                        numberField({
                            model,
                            field: 'blue',
                            width: 50,
                            value: blue,
                            min: 0,
                            max: 255,
                            commitOnChange: true
                        }),
                        box({
                            style: {backgroundColor: profileColor}, width: 30, height: 30
                        })
                    ),
                    hbox(
                        label(this.renderLabel('Age: ')),
                        numberField({model, field: 'age', width: 50, min: 0})
                    ),
                    hbox(
                        label(this.renderLabel('E-Mail: ')),
                        textField({
                            model,
                            field: 'email',
                            placeholder: 'name@domain.com',
                            commitOnChange: true,
                            leftIcon: Icon.mail(),
                            rightElement: button({
                                icon: Icon.cross(),
                                minimal: true,
                                onClick: () => model.setEmail(null)
                            })
                        })
                    ),
                    hbox(
                        label(this.renderLabel('Company: ')),
                        textField({model, field: 'company'})
                    ),
                    hbox(
                        label(this.renderLabel('State: ')),
                        selectField({
                            options: usStates,
                            model,
                            field: 'state',
                            placeholder: 'Select a State...'
                        }),
                    ),
                    hbox(
                        label(this.renderLabel('Favorite Movie: ')),
                        comboField({
                            options: movies,
                            model,
                            field: 'movie',
                            placeholder: 'Search...'
                        }),
                    ),
                    vbox(
                        label(this.renderLabel('Preferred Salary Range: ')),
                        sliderField({
                            model,
                            field: 'salaryRange',
                            min: 50000,
                            max: 150000,
                            labelStepSize: 25000,
                            stepSize: 1000,
                            paddingRight: 20,
                            labelRenderer: val => `$${val / 1000}k`
                        })
                    ),
                    hbox(
                        label(this.renderLabel('Start Date')),
                        dayField({
                            model,
                            field: 'startDate',
                            commitOnChange: true,
                            minDate: moment(new Date())
                                .subtract(2, 'years')
                                .toDate(),
                            maxDate: new Date()
                        })
                    ),
                    hbox(
                        label(this.renderLabel('Active: ')),
                        checkField({model, field: 'active'}),
                        label({
                            style: {paddingRight: '10px'},
                            item: 'or'
                        }),
                        switchField({model, field: 'active'}),
                    )
                ]
            })
        });
    }

    getRawValueInfo() {
        const {active, age, company, email, getDisplayValue, movie, password, startDate, state, user, verify, red, green, blue} = this.model;
        return panel({
            title: 'Current Values',
            width: 270,
            className: 'rawvalues',
            item: vbox({
                className: 'xh-panel-body',
                items: [
                    hbox(
                        label('User:'),
                        label(getDisplayValue(user)),
                    ),
                    hbox(
                        label('Password:'),
                        label(getDisplayValue(password)),
                    ),
                    hbox(
                        label('Verify:'),
                        label(getDisplayValue(verify)),
                    ),
                    hbox(
                        label('Profile Color:'),
                        label(`rgb(${getDisplayValue(red)}, ${getDisplayValue(green)}, ${getDisplayValue(blue)})`),
                    ),
                    hbox(
                        label('Age:'),
                        label(`${getDisplayValue(age)}`),
                    ),
                    hbox(
                        label('E-Mail:'),
                        label(getDisplayValue(email)),
                    ),
                    hbox(
                        label('Company:'),
                        label(getDisplayValue(company)),
                    ),
                    hbox(
                        label('State:'),
                        label(getDisplayValue(state)),
                    ),
                    hbox(
                        label('Favorite Movie:'),
                        label(getDisplayValue(movie)),
                    ),
                    hbox(
                        label('Start Date:'),
                        label(getDisplayValue(fmtDate(startDate))),
                    ),
                    hbox(
                        label('Active:'),
                        label(getDisplayValue(active)),
                    )
                ]
            })
        });
    }

    renderLabel(text) {
        const isValid = this.model.isFieldValid(text),
            width = 110;
        const item = <span>{text}<span style={{color: 'red'}}>{!isValid ? '*' : ''}</span> </span>;

        return {item, width};
    }

    onFormSubmit = () => {
        XH.toast({message: 'You clicked the Save button...'});
    }
}