import {useEffect} from 'react';
import {hoistCmp, creates, useContextModel} from '@xh/hoist/core';
import {TradesModel} from './TradesModel';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {grid} from '@xh/hoist/cmp/grid';
import {select} from '@xh/hoist/desktop/cmp/input';
import {filler} from '@xh/hoist/cmp/layout';
import {storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {OpenFinWindowModel} from '../../../openfin/window';

export const tradesPanel = hoistCmp.factory({
    model: creates(TradesModel),
    render: ({model}) => {
        const {gridModel, loadModel} = model,
            openFinWindowModel = useContextModel(OpenFinWindowModel);

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
    }
});