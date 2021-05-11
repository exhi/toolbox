import {creates, hoistCmp} from '@xh/hoist/core';
import {filler, span} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {treeMap} from '@xh/hoist/desktop/cmp/treemap';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {select} from '@xh/hoist/desktop/cmp/input';

import {SimpleTreeMapModel} from './SimpleTreeMapModel';
import {wrapper} from '../../common';

export const simpleTreeMapPanel = hoistCmp.factory({
    model: creates(SimpleTreeMapModel),

    render() {
        return wrapper(
            panel({
                icon: Icon.gridLarge(),
                title: 'Simple TreeMap',
                mask: 'onLoad',
                width: 800,
                height: 600,
                item: treeMap(),
                bbar: bbar()
            })
        );
    }
});

const bbar = hoistCmp.factory(
    ({model}) => toolbar(
        filler(),
        span('Max Heat'),
        select({
            model: model.treeMapModel,
            bind: 'maxHeat',
            width: 120,
            options: [
                {label: 'None (auto)', value: undefined},
                {label: '0.5', value: 0.5},
                {label: '1', value: 1},
                {label: '2', value: 2}
            ]
        }),
        '-',
        span('Color Mode'),
        select({
            model: model.treeMapModel,
            bind: 'colorMode',
            width: 120,
            options: [
                {label: 'Linear', value: 'linear'},
                {label: 'Wash', value: 'wash'},
                {label: 'None', value: 'none'}
            ]
        }),
        '-',
        span('Algorithm'),
        select({
            model: model.treeMapModel,
            bind: 'algorithm',
            width: 120,
            options: [
                {label: 'Squarified', value: 'squarified'},
                {label: 'Slice and Dice', value: 'sliceAndDice'},
                {label: 'Stripes', value: 'stripes'},
                {label: 'Strip', value: 'strip'}
            ]
        })
    )
);