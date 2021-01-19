import {HoistModel, LoadSupport, managed, XH} from '@xh/hoist/core';
import {Cube} from '@xh/hoist/data';
import {fmtThousands} from '@xh/hoist/format';
import {times, upperFirst} from 'lodash';
import {SECONDS} from '@xh/hoist/utils/datetime';
import {Timer} from '@xh/hoist/utils/async';
import {pluralize} from '@xh/hoist/utils/js';

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

        this.timer = Timer.create({
            runFn: () => this.streamChangesAsync(),
            interval: () => parent.updateFreq ?? -1,
            intervalUnits: SECONDS
        });
    }

    async doLoadAsync(loadSpec) {
        const LTM = this.parent.loadTimesModel;
        let orders = [];
        await LTM.withLoadTime('Fetch orders', async () => {
            orders = await XH.portfolioService.getAllOrdersAsync({loadSpec});
            orders.forEach(it => it.maxConfidence = it.minConfidence = it.confidence);
        });

        const ocTxt = fmtThousands(orders.length) + 'k';
        await LTM.withLoadTime(`Loaded ${ocTxt} orders in Cube`, async () => {
            await this.cube.loadDataAsync(orders, {asOf: Date.now()});
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
                {name: 'dir', displayName: 'Direction', isDimension: true, aggregator: 'UNIQUE'},

                {name: 'quantity', aggregator: 'SUM', canAggregateFn: isInstrument},
                {name: 'price', aggregator: 'UNIQUE', canAggregateFn: isInstrument},

                {name: 'commission', aggregator: 'SUM'},

                {name: 'maxConfidence', aggregator: 'MAX'},
                {name: 'minConfidence', aggregator: 'MIN'},
                {name: 'time', aggregator: 'MAX'}
            ],
            bucketSpecFn: (row, children) => {
                // We will bucket fund aggregate rows or order leaf rows
                const childDimName = children[0]?._meta.dimName,
                    isLeaf = children[0]?._meta.isLeaf;
                if (!isLeaf && childDimName !== 'fund') return null;

                return {
                    labelFn: (bucket) => `${bucket} ${pluralize(upperFirst(childDimName ?? 'order'))}`,
                    bucketFn: (row) => {
                        if (['Red River', 'Hudson Bay'].includes(row.fund)) {
                            return 'Wet';
                        } else if (['Winter Star', 'Black Crescent'].includes(row.fund)) {
                            return 'Celestial';
                        }
                    }
                };
            }
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
            await this.cube.updateDataAsync(updates, {asOf: Date.now()});
        });
    }
}
