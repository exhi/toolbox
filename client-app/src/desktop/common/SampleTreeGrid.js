/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {elemFactory, HoistComponent, HoistModel, LayoutSupport, LoadSupport, XH, managed} from '@xh/hoist/core';
import {filler} from '@xh/hoist/cmp/layout';
import {grid, GridModel, emptyFlexCol} from '@xh/hoist/cmp/grid';
import {storeFilterField, storeCountLabel} from '@xh/hoist/desktop/cmp/store';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {colChooserButton, exportButton, refreshButton} from '@xh/hoist/desktop/cmp/button';
import {toolbarSep, toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {numberRenderer, millionsRenderer, fmtNumberTooltip} from '@xh/hoist/format';
import {DimensionChooserModel, dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {select, switchInput} from '@xh/hoist/desktop/cmp/input';
import {bindable} from '@xh/hoist/mobx';

import {gridStyleSwitches} from './GridStyleSwitches';

@HoistComponent
@LayoutSupport
class SampleTreeGrid extends Component {

    model = new Model();

    render() {
        const {model} = this,
            {gridModel} = model;

        return panel({
            tbar: toolbar(
                refreshButton({model}),
                toolbarSep(),
                dimensionChooser({
                    model: model.dimChooserModel
                }),
                filler(),
                storeCountLabel({gridModel}),
                storeFilterField({gridModel, filterOptions: {includeChildren: model.filterIncludeChildren}}),
                colChooserButton({gridModel}),
                exportButton({gridModel})
            ),
            item: grid({model: gridModel}),
            mask: model.loadModel,
            bbar: toolbar(
                select({
                    model: gridModel,
                    bind: 'showSummary',
                    width: 130,
                    enableFilter: false,
                    options: [
                        {label: 'Top Total', value: 'top'},
                        {label: 'Bottom Total', value: 'bottom'},
                        {label: 'No Total', value: false}
                    ]
                }),
                filler(),
                gridStyleSwitches({gridModel}),
                toolbarSep(),
                switchInput({
                    model,
                    bind: 'filterIncludeChildren',
                    label: 'Filter w/Children',
                    labelAlign: 'left'
                })
            ),
            className: this.getClassName(),
            ...this.getLayoutProps()
        });
    }
}
export const sampleTreeGrid = elemFactory(SampleTreeGrid);


@HoistModel
@LoadSupport
class Model {

    @bindable
    filterIncludeChildren = false;
    
    @managed
    dimChooserModel = new DimensionChooserModel({
        dimensions: [
            {value: 'region', label: 'Region'},
            {value: 'sector', label: 'Sector'},
            {value: 'symbol', label: 'Symbol'}
        ],
        initialValue: ['sector', 'symbol']
    });

    @managed
    gridModel = new GridModel({
        treeMode: true,
        store: {
            loadRootAsSummary: true
        },
        sortBy: 'pnl|desc|abs',
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        compact: XH.appModel.useCompactGrids,
        columns: [
            {
                headerName: 'Name',
                width: 200,
                field: 'name',
                isTreeColumn: true
            },
            {
                field: 'mktVal',
                headerName: 'Mkt Value (m)',
                headerTooltip: 'Market value (in millions USD)',
                align: 'right',
                width: 130,
                absSort: true,
                agOptions: {
                    aggFunc: 'sum'
                },
                tooltip: (val) => fmtNumberTooltip(val, {ledger: true}),
                renderer: millionsRenderer({
                    precision: 3,
                    ledger: true
                })
            },
            {
                headerName: 'P&L',
                field: 'pnl',
                    align: 'right',
                width: 130,
                absSort: true,
                agOptions: {
                    aggFunc: 'sum'
                },
                tooltip: (val) => fmtNumberTooltip(val, {ledger: true}),
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true,
                    colorSpec: true
                })
            },
            {...emptyFlexCol}
        ]
    });

    constructor() {
        // Load data when dimensions change
        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: () => this.loadAsync()
        });

        // Bind dimensions to url parameter
        this.addReaction({
            track: () => XH.routerState,
            run: this.syncDimsToRouter,
            fireImmediately: true
        });

        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: () => this.syncRouterToDims()
        });
    }

    async doLoadAsync(loadSpec) {
        const {gridModel, dimChooserModel} = this,
            dims = dimChooserModel.value;

        return XH.portfolioService
            .getPortfolioAsync(dims, true)
            .then(data => {
                gridModel.loadData(data);
                gridModel.selectFirst();
            });
    }

    syncDimsToRouter() {
        if (!XH.router.isActive('default.grids.tree')) return;

        const {dims} = XH.routerState.params;
        if (!dims) {
            this.syncRouterToDims({replace: true});
        } else {
            this.dimChooserModel.setValue(dims.split('.'));
        }
    }

    syncRouterToDims(opts) {
        if (!XH.router.isActive('default.grids.tree')) return;

        const {dimChooserModel} = this,
            dims = dimChooserModel.value.join('.');

        XH.navigate(XH.routerState.name, {dims}, opts);
    }
}

