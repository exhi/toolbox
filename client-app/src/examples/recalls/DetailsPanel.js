/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */

import {Component} from 'react';
import {elemFactory, HoistComponent} from '@xh/hoist/core';
import {div, table, tbody, tr, th, td} from '@xh/hoist/cmp/layout';

@HoistComponent
class DetailsPanel extends Component {

    render() {
        const {model} = this,
            {currentRecord} = model;

        if (!currentRecord) return null;

        return div({
            className: 'recalls-detail-wrapper',
            item: table(
                tbody(
                    tr(th('Brand Name'), td(`${currentRecord.brandName}`)),
                    tr(th('Generic Name'), td(`${currentRecord.genericName}`)),
                    tr(th('Classification'), td(`${model.classificationDetails}`)),
                    tr(th('Description'), td(`${currentRecord.description}`)),
                    tr(th('Recalling Firm'), td(`${currentRecord.recallingFirm}`)),
                    tr(th('Reason For Recall'), td(`${currentRecord.reason}`))
                )
            )
        });
    }

}

export const detailsPanel = elemFactory(DetailsPanel);