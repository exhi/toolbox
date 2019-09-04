import {HoistModel, XH, LoadSupport} from '@xh/hoist/core';
import {GridModel} from '@xh/hoist/cmp/grid';
import {fmtNumberTooltip, millionsRenderer, numberRenderer} from '@xh/hoist/format';
import {clamp} from 'lodash';
import {DimensionChooserModel} from '@xh/hoist/cmp/dimensionchooser';
import {managed} from '@xh/hoist/core/mixins';
import {bindable, runInAction} from '@xh/hoist/mobx';
import {Icon, convertIconToSvg} from '@xh/hoist/icon/Icon';
import {box} from '@xh/hoist/cmp/layout';
import {isRunningInOpenFin, createWindowAsync, createChannelAsync} from '@xh/hoist/openfin/utils';
import {formatPositionId} from '../../common/Misc';
import {StoreContextMenu} from '@xh/hoist/desktop/cmp/contextmenu';
import * as Notifications from 'openfin-notifications';
import {wait} from '@xh/hoist/promise';
import {throwIf} from '@xh/hoist/utils/js';

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
                colId: 'tradesWidgetDragger',
                headerName: '',
                width: 24,
                hidden: !isRunningInOpenFin(),
                elementRenderer: (v, {record}) => {
                    return box({
                        className: 'widget-dragger',
                        draggable: true,
                        onDragEnd: (e) => {
                            e.persist();
                            console.debug('Trades Widget Drag End', e);

                            if (isRunningInOpenFin()) {
                                createWindowAsync(`trades-widget-${record.id}-${XH.genId()}`, {
                                    url: XH.router.buildUrl('default.positionTrades',
                                        {positionId: record.id}),
                                    frame: false,
                                    defaultLeft: e.screenX,
                                    defaultTop: e.screenY,
                                    saveWindowState: false,
                                    customData: JSON.stringify({
                                        title: `Trades | ${formatPositionId(record.id)}`,
                                        icon: convertIconToSvg(Icon.bolt())
                                    })
                                });
                            }
                        },
                        item: Icon.bolt()
                    });
                }
            },
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
        ],
        contextMenuFn: (agParams, gridModel) => {
            return new StoreContextMenu({
                gridModel,
                items: [
                    {
                        icon: Icon.info(),
                        text: 'Position Info',
                        actionFn: ({record}) => {
                            const id = `xh-dashboard-notification-${XH.genId()}`;
                            Notifications.create({
                                id,
                                title: formatPositionId(record.id),
                                body: `Position ${formatPositionId(record.id)} has ${record.children ? record.children.length : 0} child positions`,
                                category: 'Positions',
                                icon: 'https://localhost:3000/public/xh.png'
                            });

                            wait(5000).then(() => Notifications.clear(id));

                        }
                    },
                    {
                        icon: Icon.skull(),
                        text: 'Terminate',
                        actionFn: ({record}) => {
                            const id = `xh-dashboard-notification-${XH.genId()}`;
                            Notifications.create({
                                id,
                                title: `${formatPositionId(record.id)} Terminated`,
                                body: `Position ${formatPositionId(record.id)} has been terminated`,
                                category: 'Positions',
                                icon: 'https://localhost:3000/public/xh.png'
                            });
                        }
                    },
                    '-',
                    ...GridModel.defaultContextMenuTokens
                ]
            });
        }
    });

    /** @member {PositionSession} */
    @managed session;

    @bindable loadTimestamp;

    @bindable.ref channel;

    /** @member {OpenFinWindowModel} */
    openFinWindowModel;

    constructor() {
        this.addReaction({
            track: () => this.dimChooserModel.value,
            run: () => this.loadAsync()
        });

        this.addReaction({
            track: () => [this.channel, this.gridModel.selectedRecord],
            run: ([channel, record]) => {
                if (!channel) return;

                const payload = {positionId: record ? record.id : null};
                console.debug('Publishing position-selected action with payload', payload);
                channel.publish('position-selected', JSON.stringify(payload));
            }
        });

        this.initAsync();
    }

    async initAsync({openFinWindowModel}) {
        if (isRunningInOpenFin()) {
            throwIf(!openFinWindowModel, 'Need to be provided an OpenFinWindowModel when running in OpenFin!');

            runInAction(async () => {
                this.openFinWindowModel = openFinWindowModel;
                this.openFinWindowModel.setTitle('Positions');
                this.openFinWindowModel.setIcon(convertIconToSvg(Icon.portfolio()));

                this.setChannel(await createChannelAsync('positions-grid'));
            });

            this.channel.onConnection((identity, payload) => {
                console.debug('positions-grid channel connection from', identity, payload);
            });
        }
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