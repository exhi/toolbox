import {hoistElemFactory, useLocalModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {TradingVolumeChartModel} from './TradingVolumeChartModel';

export const tradingVolumeChartPanel = hoistElemFactory(() => {
    const model = useLocalModel(TradingVolumeChartModel),
        {chartModel, loadModel} = model;

    return panel({
        item: chart({model: chartModel}),
        mask: loadModel
    });
});