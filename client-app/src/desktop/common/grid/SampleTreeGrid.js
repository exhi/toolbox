import {grid, gridCountLabel} from '@xh/hoist/cmp/grid';
import {filler, hframe} from '@xh/hoist/cmp/layout';
import {hoistCmp, uses} from '@xh/hoist/core';
import {colChooserButton, exportButton, refreshButton} from '@xh/hoist/desktop/cmp/button';
import {groupingChooser} from '@xh/hoist/desktop/cmp/grouping';
import {select, switchInput} from '@xh/hoist/desktop/cmp/input';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {storeFilterField} from '@xh/hoist/cmp/store';
import {toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {SampleTreeGridModel} from './SampleTreeGridModel';
import {gridOptionsPanel} from './options/GridOptionsPanel';

export const [SampleTreeGrid, sampleTreeGrid] = hoistCmp.withFactory({

    model: uses(SampleTreeGridModel),

    render({model, ...props}) {
        const {gridModel} = model;
        return panel({
            item: hframe(grid(), gridOptionsPanel({model: gridModel})),
            ref: model.panelRef,
            tbar: [
                refreshButton(),
                toolbarSep(),
                groupingChooser(),
                filler(),
                gridCountLabel({includeChildren: true}),
                storeFilterField(),
                colChooserButton(),
                exportButton()
            ],
            mask: 'onLoad',
            bbar: [
                select({
                    model: gridModel,
                    bind: 'showSummary',
                    width: 130,
                    enableFilter: false,
                    options: [
                        {label: 'Top Total', value: 'top'},
                        {label: 'Bottom Total', value: 'bottom'},
                        {label: 'No Total', value: false}
                    ]
                }),
                toolbarSep(),
                switchInput({
                    bind: 'filterIncludesChildren',
                    label: 'Filter w/Children',
                    labelSide: 'left'
                })
            ],
            ...props
        });
    }
});

