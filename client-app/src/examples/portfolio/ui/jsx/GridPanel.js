import React from 'react';
import {hoistCmp, uses} from '@xh/hoist/core';
import {Grid, GridCountLabel} from '@xh/hoist/cmp/grid';
import {Filler} from '@xh/hoist/cmp/layout';
import {RelativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {RefreshButton} from '@xh/hoist/desktop/cmp/button';
import {DimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {Panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';

import {GridPanelModel} from '../../GridPanelModel';

export const GridPanel = hoistCmp({
    model: uses(GridPanelModel),

    render({model}) {
        return <Panel
            title='Positions'
            icon={Icon.portfolio()}
            bbar={[
                <DimensionChooser/>,
                <GridCountLabel unit='position'/>,
                <Filler/>,
                <RelativeTimestamp timestamp={model.loadTimestamp}/>,
                <RefreshButton intent='success'/>
            ]}
        >
            <Grid/>
        </Panel>;
    }
});