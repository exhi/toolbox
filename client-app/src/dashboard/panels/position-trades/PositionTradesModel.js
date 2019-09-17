import {XH, HoistModel, LoadSupport, RouteSupport, routeParam} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {createTradesGridModel} from '../../common/Trades';
import {isNil} from 'lodash';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {formatPositionId} from '../../common/Misc';
import {SyncSupport, sync} from '@xh/hoist/openfin';

@HoistModel
@LoadSupport
@SyncSupport('positions')
@RouteSupport({name: 'default.positionTrades'})
export class PositionTradesModel {

    @bindable
    @routeParam
    positionId;

    @bindable
    @sync
    loadTimestamp;

    @bindable
    @routeParam
    isLinked = false;

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
            track: () => this.positionId,
            run: () => this.loadAsync()
        });
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