/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */

import {Component} from 'react';
import {HoistComponent, elemFactory} from '@xh/hoist/core';
import {dataView} from '@xh/hoist/desktop/cmp/dataview';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {filler} from '@xh/hoist/cmp/layout';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {select} from '@xh/hoist/desktop/cmp/input';
import {storeFilterField} from '@xh/hoist/desktop/cmp/store';
import {storeCountLabel} from '@xh/hoist/desktop/cmp/store';
import './NewsPanelItem.scss';

@HoistComponent
export class NewsPanel extends Component {

    render() {
        const {model} = this,
            {viewModel} = model;

        return panel({
            className: 'toolbox-news-panel',
            width: '100%',
            height: '100%',
            item: dataView({
                model: viewModel,
                rowCls: 'news-item',
                itemHeight: 120,
                onRowDoubleClicked: this.onRowDoubleClicked
            }),
            mask: model.loadModel,
            bbar: toolbar({
                items: [
                    storeFilterField({
                        onFilterChange: this.onFilterChange,
                        includeFields: model.SEARCH_FIELDS,
                        placeholder: 'Filter by title...'
                    }),
                    select({
                        model,
                        bind: 'sourceFilter',
                        options: model.sourceOptions,
                        enableMulti: true,
                        placeholder: 'Filter by source...',
                        menuPlacement: 'top',
                        width: 380
                    }),
                    filler(),
                    storeCountLabel({
                        store: viewModel.store,
                        unit: 'stories'
                    })
                ]
            })
        });
    }

    onRowDoubleClicked = (e) => {
        if (e.data.url) window.open(e.data.url, '_blank');
    };

    onFilterChange = (f) => {
        this.model.setTextFilter(f);
    };
}

export const newsPanel = elemFactory(NewsPanel);

