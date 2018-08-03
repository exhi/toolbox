/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';

import {wrapper, sampleGrid} from '../../common';

@HoistComponent()
export class StandardGridPanel extends Component {

    render() {
        return wrapper(
            panel({
                title: 'Grids > Standard',
                icon: Icon.grid(),
                width: 700,
                height: 400,
                item: sampleGrid()
            })
        );
    }

}