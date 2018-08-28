/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {elemFactory, HoistComponent, LayoutSupport, XH} from '@xh/hoist/core';
import {wait} from '@xh/hoist/promise';
import {box, filler} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon';
import {grid, GridModel, colChooserButton} from '@xh/hoist/desktop/cmp/grid';
import {storeFilterField, storeCountLabel} from '@xh/hoist/desktop/cmp/store';
import {StoreContextMenu} from '@xh/hoist/desktop/cmp/contextmenu';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {exportButton, refreshButton} from '@xh/hoist/desktop/cmp/button';
import {switchField} from '@xh/hoist/desktop/cmp/form';
import {toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {boolCheckCol, emptyFlexCol} from '@xh/hoist/columns';
import {LocalStore} from '@xh/hoist/data';
import {numberRenderer, millionsRenderer} from '@xh/hoist/format';
import {PendingTaskModel} from '@xh/hoist/utils/async';
import {mask} from '@xh/hoist/desktop/cmp/mask';
import {App} from '../App';

@HoistComponent()
@LayoutSupport
class SampleGrid extends Component {

    loadModel = new PendingTaskModel();

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
        //     {
        //         field: 'active',
        //         ...boolCheckCol,
        //         headerName: '',
        //         chooserName: 'Active Status'
        //     },
        //     {
        //         field: 'company',
        //         width: 200
        //     },
        //     {
        //         field: 'city',
        //         width: 150
        //     },
        //     {
        //         headerName: 'Trade Volume',
        //         field: 'trade_volume',
        //         align: 'right',
        //         width: 130,
        //         renderer: millionsRenderer({precision: 1, label: true})
        //     },
        //     {
        //         headerName: 'P&L',
        //         field: 'profit_loss',
        //         align: 'right',
        //         width: 130,
        //         renderer: numberRenderer({precision: 0, ledger: true, colorSpec: true})
        //     },
        //     {...emptyFlexCol},
        // ]
            {
                colId: 'city2',
                field: 'city',
                width: 150
            },
            {
                headerName: 'Demographics',
                groupId: 'DEMO',
                children: [
                    {
                        field: 'active',
                        ...boolCheckCol,
                        headerName: '',
                        chooserName: 'Active Status',
                        // A group can have children initially hidden. If you want to show or hide children,
                        // set columnGroupShow to either 'open' or 'closed' to one or more of the children.
                        // When a children set has columnGroupShow set, it behaves in the following way:
                        // open: The child is only shown when the group is open.
                        // closed: The child is only shown when the group is closed.
                        // everything else: Any other value, including null and undefined, the child is always shown.
                        // Do we want/need to support this?
                        // columnGroupShow: 'open'
                    },
                    {
                        headerName: 'Company',
                        width: 400,
                        children: [
                            {
                                field: 'city',
                                colID: 'CompanyCity',
                                headerName: 'Company Loc',
                                width: 200
                            }
                        ]
                    },
                    {
                        field: 'city',
                        colId: 'City3',
                        width: 150,
                        hide: true
                    },
                    {
                        field: 'city',
                        colId: 'City1',
                        width: 150
                    }
                ]
            },
            {
                headerName: 'Data',
                children: [
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
                    }
                ]
            },

            {...emptyFlexCol}
        ]
    });

    constructor(props) {
        super(props);
        this.model.setGroupBy(this.props.groupBy);
        this.loadAsync();
    }

    render() {
        const {model} = this,
            {store} = model;

        return panel({
            className: this.getClassName(),
            ...this.getLayoutProps(),
            item: grid({model}),
            mask: mask({spinner: true, model: this.loadModel}),
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
                    box('Compact mode:'),
                    // switchField({
                    //     field: 'compact',
                    //     model
                    // }),
                    toolbarSep(),
                    colChooserButton({gridModel: model}),
                    exportButton({model, exportType: 'excel'}),
                    refreshButton({model: this})
                ]
            })
        });
    }

    //------------------------
    // Implementation
    //------------------------
    loadAsync() {
        wait(250)
            .then(() => this.model.loadData(App.tradeService.generateTrades()))
            .linkTo(this.loadModel);
    }

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
