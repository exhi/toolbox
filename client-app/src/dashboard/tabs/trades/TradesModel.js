import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {createTradesGridModel} from '../../common/Trades';

@HoistModel
@LoadSupport
export class TradesModel {

    gridModel = createTradesGridModel();

    async doLoadAsync() {
        const orders = await XH.portfolioService.getAllOrdersAsync();
        this.gridModel.loadData(orders);
    }
}