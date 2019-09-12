import {hoistCmp, creates} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {wrapper} from '../../common/Wrapper';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {treeMap} from '@xh/hoist/desktop/cmp/treemap';

import {SimpleTreeMapModel} from './SimpleTreeMapModel';

export const SimpleTreeMapPanel = hoistCmp({
    model: creates(SimpleTreeMapModel),

    render({model}) {
        return wrapper(
            panel({
                icon: Icon.gridLarge(),
                title: 'Simple TreeMap',
                mask: model.loadModel,
                width: 800,
                height: 600,
                item: treeMap({model: model.treeMapModel})
            })
        );
    }
});