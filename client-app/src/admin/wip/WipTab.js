/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {SimpleTreeMapPanel} from './treeMap/SimpleTreeMapPanel';

@HoistComponent
export class WipTab extends Component {

    render() {
        return tabContainer({
            model: {
                route: 'default.wip',
                tabs: [
                    {id: 'simpleTreeMap', title: 'Simple TreeMap', content: SimpleTreeMapPanel}
                ],
                switcherPosition: 'left'
            }
        });
    }
}