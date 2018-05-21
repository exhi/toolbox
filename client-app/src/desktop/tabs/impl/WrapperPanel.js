/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */

import {Component} from 'react';
import {elemFactory} from '@xh/hoist/core';
import {div} from '@xh/hoist/cmp/layout';

class WrapperPanel extends Component {
    render() {
        return div({
            cls: 'xh-toolbox-wrapper-panel',
            ...this.props
        });
    }
}

export const wrapperPanel = elemFactory(WrapperPanel);