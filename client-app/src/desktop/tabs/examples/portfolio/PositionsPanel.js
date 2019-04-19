import {storeCountLabel} from '@xh/hoist/desktop/cmp/store';

/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {elemFactory, HoistComponent, LayoutSupport} from '@xh/hoist/core/index';
import {filler, hbox} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon/';
import {panel, PanelModel} from '@xh/hoist/desktop/cmp/panel';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {refreshButton} from '@xh/hoist/desktop/cmp/button';
// import {dimensionChooser} from '@xh/hoist/desktop/cmp/dimensionchooser';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {grid} from '@xh/hoist/cmp/grid';
import {dimensionsManager} from './dimensions/DimensionsManager';

@HoistComponent
@LayoutSupport
export class PositionsPanel extends Component {

    dimensionsPanelModel = new PanelModel({
        defaultSize: 200,
        side: 'left',
        showHeaderCollapseButton: false
    });

    render() {
        const {model, dimensionsPanelModel} = this,
            {dimensionsModel} = model;

        return panel({
            title: 'Positions',
            icon: Icon.portfolio(),
            mask: model.loadModel,
            model: {
                defaultSize: 500,
                side: 'left'
            },
            item: hbox({
                flex: 1,
                items: [
                    panel({
                        title: dimensionsPanelModel.collapsed ? dimensionsModel.formattedDimensions : null,
                        model: dimensionsPanelModel,
                        item: dimensionsManager({model: dimensionsModel})
                    }),
                    panel({

                        item: grid({model: model.gridModel}),
                        bbar: toolbar(
                            // dimensionChooser({model: model.dimChooserModel}),
                            storeCountLabel({gridModel: model.gridModel, unit: 'position'}),
                            filler(),
                            relativeTimestamp({timestamp: model.loadTimestamp}),
                            refreshButton({model, intent: 'success'})
                        ),
                        ...this.getLayoutProps()
                    })
                ]
            })
        });
    }
}
export const positionsPanel = elemFactory(PositionsPanel);