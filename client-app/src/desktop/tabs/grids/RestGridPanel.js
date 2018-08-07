/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import React, {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';
import {restGrid, RestGridModel, RestStore} from '@xh/hoist/desktop/cmp/rest';
import {boolCheckCol, baseCol} from '@xh/hoist/columns';
import {numberRenderer} from '@xh/hoist/format';
import {wrapper} from '../../common/Wrapper';

@HoistComponent()
export class RestGridPanel extends Component {

    localModel = new RestGridModel({
        store: new RestStore({
            url: 'rest/companyRest',
            fields: [
                {
                    name: 'name',
                    required: true
                },
                {
                    name: 'type',
                    lookupName: 'types',
                    lookupStrict: true,
                    required: true
                },
                {
                    name: 'employees',
                    label: 'Employees (#)',
                    type: 'number',
                    required: true
                },
                {
                    name: 'isActive',
                    label: 'Active?',
                    type: 'bool',
                    defaultValue: true
                },
                {
                    name: 'cfg',
                    label: 'JSON Config',
                    type: 'json'
                },
                {
                    name: 'note'
                },
                {
                    name: 'lastUpdated',
                    type: 'date',
                    editable: false
                },
                {
                    name: 'lastUpdatedBy',
                    editable: false
                }
            ]
        }),
        unit: 'company',
        filterFields: ['name', 'type', 'note'],
        sortBy: 'name',
        columns: [
            baseCol({
                field: 'name',
                flex: true
            }),
            baseCol({
                field: 'type',
                width: 180
            }),
            baseCol({
                field: 'employees',
                headerName: 'Employees',
                align: 'right',
                width: 120,
                renderer: numberRenderer({precision: 0})
            }),
            boolCheckCol({
                field: 'isActive',
                headerName: 'Active?',
                width: 100
            })
        ],
        editors: [
            {field: 'name'},
            {field: 'type'},
            {field: 'employees'},
            {field: 'note', type: 'textarea'},
            {field: 'isActive', type: 'boolCheck'},
            {field: 'cfg'},
            {field: 'lastUpdated'},
            {field: 'lastUpdatedBy'}
        ],
        emptyText: 'No companies found - try adding one...'
    });

    constructor() {
        super();
        this.model.loadAsync();
    }

    render() {
        const {model} = this;

        return wrapper({
            description: [
                <p>
                    RestGrid and its associated components provide a quick way to implement basic CRUD
                    functionality for domain objects managed by the Hoist Grails server.
                </p>,
                <p>
                    Use the toolbar buttons or double-click a record to display its associated add/edit
                    form, including type-specific editor fields. These grids are especially useful
                    when building lookup tables of simple objects and are used throughout
                    the <a href={'/admin'} target={'_blank'}>Hoist Admin Console</a>.
                </p>
            ],
            item: panel({
                title: 'Grids > REST Editor',
                icon: Icon.edit(),
                width: 700,
                height: 400,
                item: restGrid({model})
            })
        });
    }

}