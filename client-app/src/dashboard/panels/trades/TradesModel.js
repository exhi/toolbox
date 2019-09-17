import {HoistModel, LoadSupport, XH, RouteSupport} from '@xh/hoist/core';
import {createTradesGridModel} from '../../common/Trades';
import {convertIconToSvg, Icon} from '@xh/hoist/icon';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {runInAction} from '@xh/hoist/mobx';
import {SyncModel} from '@xh/hoist/openfin';
import {managed} from '@xh/hoist/core/mixins';

@HoistModel
@LoadSupport
@RouteSupport({name: 'default.trades'})
export class TradesModel {

    @managed
    gridModel = createTradesGridModel();

    /** @member {OpenFinWindowModel} */
    openFinWindowModel;

    @managed
    syncModel = new SyncModel({
        syncId: 'trades',
        isProvider: true,
        properties: [
            {
                name: 'symbol',
                valueFn: () => {
                    const {selectedRecord} = this.gridModel;
                    return selectedRecord ? selectedRecord.symbol : null;
                }
            }
        ]
    });

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