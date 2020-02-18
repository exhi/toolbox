import {HoistModel, managed, XH} from '@xh/hoist/core';
import {LoadSupport} from '@xh/hoist/core/mixins';
import {Cube} from '@xh/hoist/data/cube';
import {fmtThousands} from '@xh/hoist/format';
import {times} from 'lodash';
import {SECONDS} from '@xh/hoist/utils/datetime';
import {Timer} from '@xh/hoist/utils/async';

@HoistModel
@LoadSupport
export class CubeModel {

    @managed cube;
    @managed orders = [];
    @managed timer;

    parent;

    constructor(parent) {
        this.cube = this.createCube();
        this.parent = parent;

        const timer = Timer.create({
            runFn: () => this.streamChangesAsync(),
            interval: (parent.updateFreq ?? -1) * SECONDS
        });

        this.addReaction({
            track: () => parent.updateFreq,
            run: () => timer.setInterval((parent.updateFreq ?? -1) * SECONDS)
        });
    }

    async doLoadAsync() {
        const LTM = this.parent.loadTimesModel;
        let orders = [];
        await LTM.withLoadTime('Fetch orders', async () => {
            orders = await XH.portfolioService.getAllOrdersAsync();
            orders.forEach(it => it.maxConfidence = it.minConfidence = it.confidence);
        });

        const ocTxt = fmtThousands(orders.length) + 'k';
        await LTM.withLoadTime(`Loaded ${ocTxt} orders in Cube`, async () => {
            this.cube.loadData(orders, {asOf: Date.now()});
        });

        this.orders = orders;
    }

    createCube() {
        const isInstrument = (dim, val, appliedDims) => {
            return !!appliedDims['symbol'];
        };

        return new Cube({
            idSpec: 'id',
            fields: [
                {name: 'symbol', isDimension: true},
                {name: 'sector', isDimension: true},
                {name: 'model', isDimension: true},
                {name: 'fund', isDimension: true},
                {name: 'region', isDimension: true},
                {name: 'trader', isDimension: true},
                {name: 'dir', displayName: 'Direction', isDimension: true},
               
                {name: 'quantity', aggregator: 'SUM', canAggregateFn: isInstrument},
                {name: 'price', aggregator: 'UNIQUE', canAggregateFn: isInstrument},

                {name: 'commission', aggregator: 'SUM'},

                {name: 'maxConfidence', aggregator: 'MAX'},
                {name: 'minConfidence', aggregator: 'MIN'},
                {name: 'time', aggregator: 'MAX'}
            ]
        });
    }

    async streamChangesAsync() {
        const {orders} = this;
        if (!orders.length) return;
        const {updateCount, loadTimesModel: LTM} = this.parent;
        const updates = times(updateCount, () => {
            const random = Math.floor(Math.random() * orders.length),
                order = orders[random];

            order.commission = order.commission * (1 + (0.5 - Math.random()) * 0.1);

            return order;
        });

        await LTM.withLoadTime(`Updated ${updateCount} orders in Cube`, async () => {
            this.cube.updateData(updates, {asOf: Date.now()});
        });
    }
}