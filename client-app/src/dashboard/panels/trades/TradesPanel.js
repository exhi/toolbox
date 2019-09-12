import {useEffect, useContext} from 'react';
import {hoistElemFactory} from '@xh/hoist/core';
import {TradesModel} from './TradesModel';
import {useLocalModel} from '@xh/hoist/core/hooks';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {grid} from '@xh/hoist/cmp/grid';
import {select} from '@xh/hoist/desktop/cmp/input';
import {filler} from '@xh/hoist/cmp/layout';
import {storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {OpenFinWindowContext} from '../../../openfin/window';

export const tradesPanel = hoistElemFactory(() => {
    const model = useLocalModel(TradesModel),
        {gridModel, loadModel} = model,
        openFinWindowModel = useContext(OpenFinWindowContext);

    useEffect(() => {
        model.initAsync({openFinWindowModel});
    }, [model, openFinWindowModel]);

    return panel({
        item: grid({
            model: gridModel,
            agOptions: {
                suppressAggFuncInHeader: true,
                groupIncludeFooter: true
            }
        }),
        tbar: [
            select({
                model: gridModel,
                bind: 'groupBy',
                options: [
                    {
                        label: 'Trader',
                        value: 'trader'
                    },
                    {
                        label: 'Sector',
                        value: 'sector'
                    },
                    {
                        label: 'Fund',
                        value: 'fund'
                    },
                    {
                        label: 'Model',
                        value: 'model'
                    },
                    {
                        label: 'Region',
                        value: 'region'
                    },
                    {
                        label: 'Symbol',
                        value: 'symbol'
                    },
                    {
                        label: 'B/S',
                        value: 'dir'
                    }
                ]
            }),
            filler(),
            storeFilterField({
                gridModel,
                placeholder: 'Filter Trades...',
                width: 300
            })
        ],
        mask: loadModel
    });
});