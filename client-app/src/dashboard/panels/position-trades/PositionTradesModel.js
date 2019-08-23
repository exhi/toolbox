import {XH, HoistModel, LoadSupport} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {createTradesGridModel} from '../../common/Trades';
import {isNil} from 'lodash';

@HoistModel
@LoadSupport
export class PositionTradesModel {

    @bindable positionId;

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
    }

    syncWithRouterState() {
        const {routerState} = XH;
        if (!routerState.name.endsWith('positionTrades')) return;

        const {params} = routerState,
            {positionId} = params;

        this.setPositionId(positionId);
    }

    async doLoadAsync() {
        const {positionId} = this;
        if (isNil(positionId)) return;

        const trades = await XH.portfolioService.getOrdersAsync(positionId);

        this.gridModel.loadData(trades);
    }
}