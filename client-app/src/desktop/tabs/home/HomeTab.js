/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core/index';
import {wrapper} from '../impl/Wrapper';

@HoistComponent()
export class HomeTab extends Component {
    render() {
        return wrapper('Hello');
    }
}