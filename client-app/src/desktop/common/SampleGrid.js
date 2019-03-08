import {grid, GridModel, boolCheckCol, emptyFlexCol} from '@xh/hoist/cmp/grid';
import {box, filler, span} from '@xh/hoist/cmp/layout';
import {elemFactory, HoistComponent, LayoutSupport, XH, HoistModel, managed, LoadSupport} from '@xh/hoist/core';
import {colChooserButton, exportButton, refreshButton} from '@xh/hoist/desktop/cmp/button';
import {StoreContextMenu} from '@xh/hoist/desktop/cmp/contextmenu';
import {select, switchInput} from '@xh/hoist/desktop/cmp/input';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {storeCountLabel, storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {actionCol, calcActionColWidth} from '@xh/hoist/desktop/cmp/grid';
import {millionsRenderer, numberRenderer, fmtNumberTooltip} from '@xh/hoist/format';
import {Icon} from '@xh/hoist/icon';
import {action, observable} from '@xh/hoist/mobx';
import {wait} from '@xh/hoist/promise';
import {Component} from 'react';

@HoistComponent
@LayoutSupport
class SampleGrid extends Component {

    model = new Model();

    render() {
        const {model} = this,
            {gridModel, loadModel} = model,
            {selection} = gridModel,
            selCount = selection.length;

        let selText = 'None';
        if (selCount == 1) {
            selText = `${selection[0].company} (${selection[0].city})`;
        } else if (selCount > 1) {
            selText = `${selCount} companies`;
        }

        return panel({
            item: grid({model: gridModel}),
            mask: loadModel,
            tbar: toolbar({
                omit: this.props.omitToolbar,
                items: [
                    refreshButton({model}),
                    toolbarSep(),
                    span('Group by:'),
                    select({
                        model,
                        bind: 'groupBy',
                        options: [
                            {value: 'active', label: 'Active'},
                            {value: 'city', label: 'City'},
                            {value: false, label: 'None'}
                        ],
                        width: 120,
                        enableFilter: false
                    }),
                    toolbarSep(),
                    switchInput({
                        model: gridModel,
                        bind: 'compact',
                        label: 'Compact',
                        labelAlign: 'left'
                    }),
                    filler(),
                    storeCountLabel({gridModel, unit: 'companies'}),
                    storeFilterField({gridModel}),
                    colChooserButton({gridModel}),
                    exportButton({gridModel})
                ]
            }),
            bbar: toolbar({
                items: [
                    Icon.info(),
                    box(`Current selection: ${selText}`)
                ]
            }),
            className: this.getClassName(),
            ...this.getLayoutProps()
        });
    }
}
export const sampleGrid = elemFactory(SampleGrid);


@HoistModel
@LoadSupport
class Model {
    @observable groupBy = false;

    viewDetailsAction = {
        text: 'View Details',
        icon: Icon.search(),
        tooltip: 'View details on the selected company',
        recordsRequired: 1,
        displayFn: ({record}) => ({tooltip: `View details for ${record.company}`}),
        actionFn: ({record}) => this.showInfoToast(record)
    };

    terminateAction = {
        text: 'Terminate',
        icon: Icon.skull(),
        intent: 'danger',
        tooltip: 'Terminate this company.',
        recordsRequired: 1,
        actionFn: ({record}) => this.showTerminateToast(record),
        displayFn: ({record}) => {
            if (record.city == 'New York') {
                return {
                    disabled: true,
                    tooltip: 'New York companies cannot be terminated at this time.'
                };
            }

            return {
                tooltip: `Terminate ${record.company}`
            };
        }
    };

    @managed
    gridModel = new GridModel({
        store: {
            fields: ['id', 'company', 'active', 'city', 'trade_volume', 'profit_loss']
        },
        selModel: {mode: 'multiple'},
        sortBy: 'profit_loss|desc|abs',
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        compact: XH.appModel.useCompactGrids,
        contextMenuFn: () => {
            return new StoreContextMenu({
                items: [
                    this.viewDetailsAction,
                    this.terminateAction,
                    '-',
                    ...GridModel.defaultContextMenuTokens
                ],
                gridModel: this.gridModel
            });
        },
        columns: [
            {
                field: 'id',
                headerName: 'ID',
                hidden: true
            },
            {
                ...actionCol,
                width: calcActionColWidth(2),
                actionsShowOnHoverOnly: true,
                actions: [
                    this.viewDetailsAction,
                    this.terminateAction
                ]
            },
            {
                field: 'company',
                width: 200,
                tooltip: true
            },
            {
                field: 'city',
                width: 150,
                tooltip: (val, {record}) => `${record.company} is located in ${val}`
            },
            {
                headerName: 'Trade Volume',
                field: 'trade_volume',
                align: 'right',
                width: 130,
                tooltip: (val) => fmtNumberTooltip(val),
                renderer: millionsRenderer({
                    precision: 1,
                    label: true
                })
            },
            {
                headerName: 'P&L',
                field: 'profit_loss',
                align: 'right',
                width: 130,
                absSort: true,
                tooltip: (val) => fmtNumberTooltip(val, {ledger: true}),
                renderer: numberRenderer({
                    precision: 0,
                    ledger: true,
                    colorSpec: true
                })
            },
            {
                field: 'active',
                ...boolCheckCol,
                headerName: '',
                chooserName: 'Active Status',
                tooltip: (active, {record}) => active ? `${record.company} is active` : ''
            },
            {...emptyFlexCol}
        ]
    });
    
    async doLoadAsync(loadSpec) {
        return wait(250)
            .then(() => this.gridModel.loadData(XH.tradeService.generateTrades()));
    }

    showInfoToast(rec) {
        XH.toast({
            message: `You asked for ${rec.company} details. They are based in ${rec.city}.`,
            icon: Icon.info(),
            intent: 'primary'
        });
    }

    showTerminateToast(rec) {
        XH.toast({
            message: `You asked to terminate ${rec.company}. Sorry, ${rec.company}!`,
            icon: Icon.skull(),
            intent: 'danger'
        });
    }

    @action
    setGroupBy(groupBy) {
        this.groupBy = groupBy;
        this.gridModel.setGroupBy(groupBy);
    }
}
