/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */

import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core/index';
import {div, hbox, vbox} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {wrapper} from '../impl/Wrapper';
import {Icon} from '@xh/hoist/icon';

import './IconsTab.scss';

@HoistComponent()
export class IconsTab extends Component {

    render() {
        return wrapper(
            panel({
                title: 'Available Icons',
                width: 500,
                height: '80%',
                cls: 'toolbox-icons-panel',
                item: this.renderExample()
            })
        );
    }

    renderExample() {
        const header = (...labels) => hbox({ cls: 'header', items: labels.map(label => div(label))}),
            row = icon => hbox({cls: 'row', items: [div(icon.name), ...this.renderIconTiles(icon)]});

        return vbox({
            cls: 'toolbox-example-container',
            items: [
                header('name', 'regular', 'solid', 'light'),
                vbox({
                    overflow: 'auto',
                    items: this.getAllIcons().map(icon => row(icon))
                })
            ]
        });
    }

    getAllIcons() {
        return Object.keys(Icon).map(key => ({
            regular: Icon[key]({size: '2x'}),
            solid: Icon[key]({prefix: 'fas', size: '2x'}),
            light: Icon[key]({prefix: 'fal', size: '2x'}),
            name: key
        }));
    }

    renderIconTiles(icon) {
        return [
            div(icon.regular),
            div(icon.solid),
            div(icon.light)
        ];
    }
}
