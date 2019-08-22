import {HoistModel, XH, LoadSupport} from '@xh/hoist/core';
import {GridModel} from '@xh/hoist/cmp/grid';
import {fmtNumberTooltip, millionsRenderer, numberRenderer} from '@xh/hoist/format';
import {clamp} from 'lodash';
import {DimensionChooserModel} from '@xh/hoist/cmp/dimensionchooser';
import {managed} from '@xh/hoist/core/mixins';
import {bindable} from '@xh/hoist/mobx';

@HoistModel
@LoadSupport
export class PositionsModel {
    dimChooserModel = new DimensionChooserModel({
        dimensions: [
            {value: 'fund', label: 'Fund'},
            {value: 'model', label: 'Model'},
            {value: 'region', label: 'Region'},
            {value: 'sector', label: 'Sector'},
            {value: 'symbol', label: 'Symbol'},
            {value: 'trader', label: 'Trader'}
        ],
        preference: 'dashboardPositionDims'
    });

    gridModel = new GridModel({
        treeMode: true,
        sortBy: 'pnl|desc|abs',
        emptyText: 'No records found...',
        enableColChooser: true,
        enableExport: true,
        rowBorders: true,
        showHover: true,
        showSummary: true,
        compact: true,
        stateModel: 'portfolio-positions-grid',
        store: {
            processRawData: (r) => {
                return {
                    pnlMktVal: clamp(r.pnl / Math.abs(r.mktVal), -1, 1),
                    ...r
                };
            },
            fields: [
                {name: 'name'},
                {name: 'mktVal'},
                {name: 'pnl', label: 'P&L'},
                {name: 'pnlMktVal', label: 'P&L / Mkt Val'}
            ],
            loadRootAsSummary: true
        },
        columns: [
            {
                field: 'id',
                headerName: 'ID',
                width: 40,
                hidden: true
            },
            {
                field: 'name',
                headerName: 'Name',
                flex: 1,
                minWidth: 180,
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
                field: 'pnl',
                headerName: 'P&L',
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
            }
        ]
    });

    /** @member {PositionSession} */
    @managed session;

    @bindable loadTimestamp;

    constructor() {
        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: () => this.loadAsync()
        });
    }

    async doLoadAsync() {
        const {gridModel, dimChooserModel} = this;

        let {session} = this;
        if (session) session.destroy();

        session = await XH.portfolioService.getLivePositionsAsync(dimChooserModel.value, 'mainApp');

        gridModel.loadData([session.initialPositions.root]);
        session.onUpdate = ({data}) => {
            this.setLoadTimestamp(Date.now());
            gridModel.updateData(data);
        };

        this.session = session;

        if (!gridModel.selectedRecord) {
            gridModel.selectFirst();
        }
    }
}