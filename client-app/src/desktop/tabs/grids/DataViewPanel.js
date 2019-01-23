import React, {Component} from 'react';
import {HoistComponent, HoistModel, RefreshSupport, XH} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {filler} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {refreshButton} from '@xh/hoist/desktop/cmp/button';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {dataView, DataViewModel} from '@xh/hoist/desktop/cmp/dataview';
import {LocalStore} from '@xh/hoist/data';

import {wrapper} from '../../common/Wrapper';
import {dataViewItem} from './DataViewItem';
import './DataViewItem.scss';

@HoistComponent
@RefreshSupport
export class DataViewPanel extends Component {

    model = new LocalModel();

    render() {
        const {model} = this;

        return wrapper({
            description: [
                <p>
                    The DataView component leverages an underlying Grid / GridModel instance to
                    display individual component "cards" for each rendered item.
                </p>
            ],
            item: panel({
                className: 'toolbox-dataview-panel',
                title: 'Grids > DataView',
                icon: Icon.addressCard(),
                width: 700,
                height: 400,
                item: dataView({
                    model: model.dataViewModel,
                    rowCls: 'dataview-item',
                    itemHeight: 70
                }),
                bbar: toolbar(
                    refreshButton({model}),
                    filler(),
                    storeFilterField({store: model.dataViewModel.store})
                )
            })
        });
    }
}

@HoistModel
class LocalModel {

    dataViewModel = new DataViewModel({
        store: new LocalStore({
            fields: ['id', 'name', 'city', 'value']
        }),
        itemRenderer: (v, {record}) => dataViewItem({record})
    });

    constructor() {
        this.loadAsync();
    }

    loadAsync() {
        const companies = XH.companyService.randomCompanies,
            min = -1000,
            max = 1000;

        this.dataViewModel.store.loadData(companies.map(it => {
            const randVal = Math.random() * (max - min) + min;
            return {
                name: it.name,
                city: it.city,
                value: randVal
            };
        }));
    }

    destroy() {
        XH.safeDestroy(this.dataViewModel);
    }
}