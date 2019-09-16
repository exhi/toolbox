import {XH, HoistModel, LoadSupport} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {createTradesGridModel} from '../../common/Trades';
import {isNil} from 'lodash';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {formatPositionId} from '../../common/Misc';
import {SyncSupport, sync} from '@xh/hoist/openfin';

@HoistModel
@LoadSupport
@SyncSupport('positions')
export class PositionTradesModel {

    @bindable @sync.with('selectedPositionId') positionId;

    @bindable isLinked = false;

    gridModel = createTradesGridModel({
        groupBy: null,
        hiddenCols: [
            'sector',
            'trader',
            'fund',
            'model',
            'region'
        ]
    });

    @bindable.ref channel;

    /** @member {OpenFinWindowModel} */
    openFinWindowModel;

    constructor() {
        this.addReaction({
            track: () => XH.routerState,
            run: this.syncWithRouterState,
            fireImmediately: true
        });

        this.addReaction({
            track: () => this.positionId,
            run: () => this.loadAsync()
        });

        this.addReaction({
            track: () => [this.positionId, this.isLinked],
            run: ([positionId, isLinked]) => XH.router.navigate('default.positionTrades', {positionId, isLinked}, {replace: true})
        });

        // this.initAsync();

        this.initAsSubscriberAsync();
    }

    /*
    async initAsync() {
        if (isRunningInOpenFin()) {
            this.setChannel(await connectToChannelAsync('positions-grid'));

            console.debug('Channel connected');

            await this.channel.setDefaultAction((action, payload, identity) => {
                console.debug('Received', action, 'action from', identity, 'with payload', payload);
            });

            const res = await this.channel.register('position-selected', (payload, identity) => {
                console.debug('Received position-selected action from',
                    identity,
                    'with payload',
                    payload);

                if (!this.isLinked) return;

                payload = JSON.parse(payload);
                this.setPositionId(payload.positionId);
            });

            console.debug('register - result:', res);
        }
    }
     */

    syncWithRouterState() {
        const {routerState} = XH;
        if (!routerState.name.endsWith('positionTrades')) return;

        const {params} = routerState,
            {positionId, isLinked} = params;

        this.setPositionId(positionId);
        this.setIsLinked(isLinked);
    }

    async doLoadAsync() {
        const {positionId} = this;
        if (isNil(positionId)) return;

        const trades = await XH.portfolioService.getOrdersAsync(positionId);

        this.gridModel.loadData(trades);

        if (isRunningInOpenFin() && this.openFinWindowModel) {
            this.openFinWindowModel.setTitle(`Trades | ${formatPositionId(positionId)}`);
        }
    }
}