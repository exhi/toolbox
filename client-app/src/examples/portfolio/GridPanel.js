import {hoistCmpFactory, providedAndPublished} from '@xh/hoist/core';
import {grid, gridCountLabel} from '@xh/hoist/cmp/grid';
import {filler} from '@xh/hoist/cmp/layout';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {refreshButton} from '@xh/hoist/desktop/cmp/button';
import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';

import {GridPanelModel} from './GridPanelModel';

export const gridPanel = hoistCmpFactory({
    model: providedAndPublished(GridPanelModel),

    render({model}) {
        const {parentModel} = model;  // This will be discoverable by contextd

        return panel({
            title: 'Positions',
            icon: Icon.portfolio(),
            item: grid({model: model.gridModel}),
            bbar: [
                dimensionChooser({model: parentModel.dimChooserModel}),
                gridCountLabel({gridModel: model.gridModel, unit: 'position'}),
                filler(),
                relativeTimestamp({timestamp: model.loadTimestamp}),
                refreshButton({model: parentModel, intent: 'success'})
            ]
        });
    }
});