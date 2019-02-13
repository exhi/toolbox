import {Component} from 'react';
import {HoistComponent, elemFactory} from '@xh/hoist/core';
import {box} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';

import './Wrapper.scss';

@HoistComponent
class Wrapper extends Component {
    render() {
        const {description, children, ...rest} = this.props;

        return box({
            className: 'toolbox-wrapper xh-tiled-bg',
            items: [
                panel({
                    className: 'toolbox-wrapper-description',
                    item: description,
                    width: 700,
                    marginBottom: 10,
                    omit: !description
                }),
                children
            ],
            ...rest
        });
    }
}
export const wrapper = elemFactory(Wrapper);