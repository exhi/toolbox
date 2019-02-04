/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {elemFactory, HoistComponent, HoistModel, LayoutSupport, LoadSupport, XH, managed} from '@xh/hoist/core';
import {grid, GridModel, emptyFlexCol} from '@xh/hoist/cmp/grid';
import {filler, fragment} from '@xh/hoist/cmp/layout';
import {LocalStore} from '@xh/hoist/data';
import {colChooserButton, exportButton, refreshButton} from '@xh/hoist/desktop/cmp/button';
import {checkbox, switchInput} from '@xh/hoist/desktop/cmp/input';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {storeCountLabel, storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {numberRenderer} from '@xh/hoist/format';
import {PendingTaskModel} from '@xh/hoist/utils/async';
import {DimensionChooserModel, dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';

import './SampleTreeWithCheckboxGrid.scss';

@HoistComponent
@LayoutSupport
@LoadSupport
class SampleTreeWithCheckboxGrid extends Component {

    model = new Model();

    render() {
        const {model} = this,
            {gridModel} = model;

        return panel({
            tbar: toolbar(
                dimensionChooser({
                    model: model.dimChooserModel
                })
            ),
            item: grid({className: 'sample-tree-checkbox-grid', model: gridModel}),
            mask: model.loadModel,
            bbar: toolbar(
                refreshButton({model}),
                toolbarSep(),
                switchInput({
                    model: gridModel,
                    bind: 'compact',
                    label: 'Compact',
                    labelAlign: 'left'
                }),
                filler(),
                storeCountLabel({gridModel, units: 'companies'}),
                storeFilterField({gridModel}),
                colChooserButton({gridModel}),
                exportButton({gridModel})
            ),
            className: this.getClassName(),
            ...this.getLayoutProps()
        });
    }
}
export const sampleTreeWithCheckboxGrid = elemFactory(SampleTreeWithCheckboxGrid);

@HoistModel
class Model {

    @managed
    loadModel = new PendingTaskModel();

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
        store: new LocalStore({
            fields: [
                'id', 'name', 'pnl',
                {name: 'enabled', type: 'bool', defaultValue: false}
            ]
        }),
        sortBy: 'name',
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        compact: XH.appModel.useCompactGrids,
        columns: [
            {
                headerName: 'Name',
                width: 200,
                field: 'name',
                ...this.createCustomTreeColumn()
            },
            {
                headerName: 'P&L',
                field: 'pnl',
                align: 'right',
                width: 130,
                agOptions: {
                    aggFunc: 'sum'
                },
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true,
                    colorSpec: true,
                    tooltip: true
                })
            },
            {...emptyFlexCol}
        ]
    });

    constructor() {
        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: this.loadAsync,
            fireImmediately: true
        });
    }

    //------------------------
    // Implementation
    //------------------------
    loadAsync() {
        const {gridModel, loadModel, dimChooserModel} = this,
            dims = dimChooserModel.value;

        return XH.portfolioService
            .getPortfolioAsync(dims)
            .then(data => gridModel.loadData(data))
            .linkTo(loadModel);
    }


    createCustomTreeColumn() {
        const me = this;
        return {
            isTreeColumn: true,
            agOptions: {
                cellRendererParams: {
                    suppressCount: true,
                    innerRendererFramework:
                        class extends Component {
                            constructor(props) {
                                super(props);
                                props.reactContainer.style = 'display: inline-block';
                            }

                            render() {
                                const rec = this.props.data;
                                return fragment(
                                    checkbox({
                                        value: rec.enabled,
                                        onChange: () => me.toggleNode(rec)
                                    }),
                                    rec.name
                                );
                            }

                            refresh() {return false}
                        }
                }
            }
        };
    }

    toggleNode(rec) {
        const {store} = this.gridModel,
            realRec = store.getById(rec.id);

        realRec.enabled = !realRec.enabled;
        this.setChildren(realRec, realRec.enabled);
        this.updateParents(realRec);
        store.noteDataUpdated();
    }

    setChildren(rec, enabled) {
        rec.children.forEach(it => {
            it.enabled = enabled;
            this.setChildren(it, enabled);
        });
    }

    updateParents(rec) {
        if (!rec.parent) return;

        const parent = rec.parent,
            isAllEnabled = (rec) => rec.children.every(it => it.enabled && isAllEnabled(it)),
            isAllDisabled = (rec) => rec.children.every(it => !it.enabled && isAllDisabled(it)),
            allEnabled = isAllEnabled(parent),
            allDisabled = isAllDisabled(parent);

        parent.enabled = allEnabled ? true : (allDisabled ? false : null);
        this.updateParents(parent);
    }
}

