import {HoistModel, LoadSupport, XH} from '@xh/hoist/core';
import {createTradesGridModel} from '../../common/Trades';
import {convertIconToSvg, Icon} from '@xh/hoist/icon';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {runInAction} from '@xh/hoist/mobx';

@HoistModel
@LoadSupport
export class TradesModel {

    gridModel = createTradesGridModel();

    /** @member {OpenFinWindowModel} */
    openFinWindowModel;

    async initAsync({openFinWindowModel}) {
        if (isRunningInOpenFin()) {
            this.openFinWindowModel = openFinWindowModel;
            runInAction(() => {
                openFinWindowModel.setTitle('Trades');
                openFinWindowModel.setIcon(convertIconToSvg(Icon.bolt()));
            });
        }
    }

    async doLoadAsync() {
        const orders = await XH.portfolioService.getAllOrdersAsync();
        this.gridModel.loadData(orders);
    }
}