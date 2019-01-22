/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {HoistComponent, XH} from '@xh/hoist/core';
import {tabContainer, TabContainerModel} from '@xh/hoist/desktop/cmp/tab';
import {FileManager} from './filemanager/FileManager';
import {NewsPanel} from './news/NewsPanel';
import {PortfolioPanel} from './portfolio/PortfolioPanel';

@HoistComponent
export class ExamplesTab extends Component {

    model = new TabContainerModel({
        route: 'default.examples',
        tabs: [
            {id: 'portfolio', content: PortfolioPanel},
            {id: 'news', content: NewsPanel},
            {id: 'fileManager', content: FileManager, omit: !XH.getUser().isHoistAdmin}
        ]
    });

    async loadAsync() {
        this.model.requestRefresh();
    }

    render() {
        return tabContainer({
            model: this.model,
            switcherPosition: 'left',
            className: 'toolbox-tab'
        });
    }
}
