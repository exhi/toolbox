import {useContext, useEffect} from 'react';
import {hoistElemFactory, useLocalModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {TradingVolumeChartModel} from './TradingVolumeChartModel';
import {OpenFinWindowContext} from '../../../openfin/window';

export const tradingVolumeChartPanel = hoistElemFactory(() => {
    const model = useLocalModel(TradingVolumeChartModel),
        {chartModel, loadModel} = model,
        openFinWindowModel = useContext(OpenFinWindowContext);

    useEffect(() => {
        model.initAsync({openFinWindowModel});
    });

    return panel({
        item: chart({model: chartModel}),
        mask: loadModel
    });
});