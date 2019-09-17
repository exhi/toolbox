import {useEffect} from 'react';
import {hoistCmp, creates, useContextModel} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {chart} from '@xh/hoist/desktop/cmp/chart';
import {TradingVolumeChartModel} from './TradingVolumeChartModel';
import {frame} from '@xh/hoist/cmp/layout';
import {isNil} from 'lodash';
import {mask} from '@xh/hoist/desktop/cmp/mask';
import {OpenFinWindowModel} from '../../../openfin/window';

export const tradingVolumeChartPanel = hoistCmp.factory({
    model: creates(TradingVolumeChartModel),
    render: ({model}) => {
        const {chartModel, loadModel, symbol} = model,
            openFinWindowModel = useContextModel(OpenFinWindowModel);

        useEffect(() => {
            model.initAsync({openFinWindowModel});
        }, [model, openFinWindowModel]);

        return panel({
            item: isNil(symbol) ? frame(mask({isDisplayed: true, message: 'No Symbol'})) : chart({model: chartModel}),
            mask: loadModel
        });
    }
});