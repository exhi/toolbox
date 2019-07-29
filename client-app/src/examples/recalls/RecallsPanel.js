/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */

import {Component} from 'react';
import {elemFactory, HoistComponent, XH} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {grid} from '@xh/hoist/cmp/grid';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {button, colChooserButton} from '@xh/hoist/desktop/cmp/button';
import {storeCountLabel} from '@xh/hoist/desktop/cmp/store';
import {a, filler, p, span, vframe} from '@xh/hoist/cmp/layout';
import {buttonGroupInput, textInput} from '@xh/hoist/desktop/cmp/input';
import {Icon} from '@xh/hoist/icon';

import {RecallsPanelModel} from './RecallsPanelModel';
import './RecallsPanel.scss';
import {detailsPanel} from './DetailsPanel';

@HoistComponent
export class RecallsPanel extends Component {

    model = new RecallsPanelModel();
    
    render() {
        const {model} = this,
            {gridModel, detailsPanelModel} = model,
            {currentRecord} = detailsPanelModel,
            fdaWebsite = 'https://open.fda.gov/apis/drug/enforcement/',
            aboutBlurb = 'This applet uses the openFDA drug enforcement reports API, ' +
                'which provides information on drug recall events since 2004. ' +
                'For more information, see: ';

        return vframe(
            panel({
                item: grid({model: gridModel}),
                mask: model.loadModel,
                tbar: toolbar(
                    textInput({
                        model,
                        bind: 'searchQuery',
                        placeholder: 'Keyword Search',
                        enableClear: true
                    }),
                    toolbarSep(),
                    span('Group By : '),
                    buttonGroupInput({
                        model: model,
                        bind: 'groupBy',
                        enableClear: true,
                        items: [
                            button({
                                text: 'Class',
                                value: 'classification'
                            }),
                            button({
                                text: 'Brand Name',
                                value: 'brandName'
                            }),
                            button({
                                text: 'Status',
                                value: 'status'
                            }),
                            button({
                                text: 'Recalling Firm',
                                value: 'recallingFirm'
                            })
                        ]
                    }),
                    filler(),
                    storeCountLabel({
                        gridModel,
                        unit: 'latest recall'
                    }),
                    toolbarSep(),
                    button({
                        title: 'About the API',
                        text: 'About',
                        icon: Icon.questionCircle(),
                        onClick: () => XH.alert({
                            message: p(aboutBlurb, a({href: fdaWebsite, item: fdaWebsite, target: '_blank'}))
                        })
                    }),
                    toolbarSep(),
                    colChooserButton({gridModel})
                )
            }),
            panel({
                title: currentRecord ? currentRecord.brandName : 'Select a drug to see its details',
                icon: Icon.detail(),
                item: detailsPanel({model: detailsPanelModel}),
                className: 'toolbox-recalls-detail-panel',
                compactHeader: true,
                model: {
                    side: 'bottom',
                    defaultSize: 325,
                    prefName: 'recallsPanelConfig'
                }
            })
        );
    }
}

export const recallsPanel = elemFactory(RecallsPanel);

