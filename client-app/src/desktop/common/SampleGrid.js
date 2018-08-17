/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {elemFactory, HoistComponent, LayoutSupport, XH} from '@xh/hoist/core';
import {filler} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon';
import {grid, GridModel, colChooserButton} from '@xh/hoist/desktop/cmp/grid';
import {storeFilterField, storeCountLabel} from '@xh/hoist/desktop/cmp/store';
import {StoreContextMenu} from '@xh/hoist/desktop/cmp/contextmenu';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {button, exportButton} from '@xh/hoist/desktop/cmp/button';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {boolCheckCol, emptyFlexCol} from '@xh/hoist/columns';
import {LocalStore} from '@xh/hoist/data';
import {numberRenderer, millionsRenderer} from '@xh/hoist/format';
import {App} from '../App';

@HoistComponent()
@LayoutSupport
class SampleGrid extends Component {

    localModel = new GridModel({
        store: new LocalStore({
            fields: ['id', 'company', 'active', 'city', 'trade_volume', 'profit_loss']
        }),
        sortBy: [{colId: 'company', sort: 'asc'}],
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        contextMenuFn: () => {
            return new StoreContextMenu({
                items: [
                    {
                        text: 'View Details',
                        icon: Icon.search(),
                        recordsRequired: 1,
                        action: (item, rec) => this.showRecToast(rec)
                    },
                    '-',
                    ...GridModel.defaultContextMenuTokens
                ],
                gridModel: this.model
            });
        },
        columns: [
            {
                field: 'active',
                ...boolCheckCol,
                headerName: '',
                chooserName: 'Active Status'
            },
            {
                field: 'company',
                width: 200
            },
            {
                field: 'city',
                width: 150
            },
            {
                headerName: 'Trade Volume',
                field: 'trade_volume',
                align: 'right',
                width: 130,
                renderer: millionsRenderer({precision: 1, label: true})
            },
            {
                headerName: 'P&L',
                field: 'profit_loss',
                align: 'right',
                width: 130,
                renderer: numberRenderer({precision: 0, ledger: true, colorSpec: true})
            },
            {...emptyFlexCol}
        ]
    });

    constructor(props) {
        super(props);

        const {model} = this;
        model.setGroupBy(this.props.groupBy);
        model.loadData(App.tradeService.allTrades);
    }

    render() {
        const {model} = this,
            {store} = model;

        return panel({
            className: this.getClassName(),
            ...this.getLayoutProps(),
            item: grid({model}),
            bbar: toolbar({
                omit: this.props.omitToolbar,
                items: [
                    storeFilterField({
                        store,
                        fields: ['company', 'city']
                    }),
                    storeCountLabel({
                        store,
                        units: 'companies'
                    }),
                    filler(),
                    button({
                        icon: Icon.grid(),
                        text: model.compact ? 'Standard' : 'Compact',
                        onClick: () => model.setCompact(!model.compact)
                    }),
                    colChooserButton({gridModel: model}),
                    exportButton({model, exportType: 'excel'})
                ]
            })
        });
    }

    //------------------------
    // Implementation
    //------------------------
    showRecToast(rec) {
        XH.alert({
            title: rec.company,
            message: `You asked to see details for ${rec.company}. They are based in ${rec.city}.`,
            confirmText: 'Close',
            confirmIntent: 'primary'
        });
    }

}
export const sampleGrid = elemFactory(SampleGrid);
