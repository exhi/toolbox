import {creates, hoistCmp} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {box, vframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {select} from '@xh/hoist/desktop/cmp/input';
import {chart} from '@xh/hoist/cmp/chart';

import {wrapper} from '../../common/Wrapper';
import {LineChartModel} from './LineChartModel';

export const lineChartPanel = hoistCmp.factory({
    model: creates(LineChartModel),

    render({model}) {
        return wrapper(
            panel({
                className: 'toolbox-linechart-panel',
                title: 'Charts › Line',
                icon: Icon.chartLine(),
                width: 800,
                height: 600,
                item: vframe({
                    className: 'toolbox-example-container',
                    item: chart()
                }),
                tbar: [
                    box('Symbol: '),
                    select({
                        bind: 'currentSymbol',
                        options: model.symbols,
                        enableFilter: false
                    })
                ]
            })
        );
    }
});