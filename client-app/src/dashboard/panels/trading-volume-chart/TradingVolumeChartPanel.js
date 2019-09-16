import {useContext, useEffect} from 'react';
import {hoistElemFactory, useLocalModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {TradingVolumeChartModel} from './TradingVolumeChartModel';
import {OpenFinWindowContext} from '../../../openfin/window';
import {frame} from '@xh/hoist/cmp/layout';
import {isNil} from 'lodash';
import {mask} from '@xh/hoist/desktop/cmp/mask';

export const tradingVolumeChartPanel = hoistElemFactory(() => {
    const model = useLocalModel(TradingVolumeChartModel),
        {chartModel, loadModel, symbol} = model,
        openFinWindowModel = useContext(OpenFinWindowContext);

    useEffect(() => {
        model.initAsync({openFinWindowModel});
    }, [model, openFinWindowModel]);

    return panel({
        item: isNil(symbol) ? frame(mask({isDisplayed: true, message: 'No Symbol'})) : chart({model: chartModel}),
        mask: loadModel
    });
});