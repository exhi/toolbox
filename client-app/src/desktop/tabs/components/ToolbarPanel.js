/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {Position} from '@xh/hoist/kit/blueprint';
import {HoistComponent} from '@xh/hoist/core';
import {wrapperPanel} from '../impl/WrapperPanel';
import {box, filler, hframe, vframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {comboField} from '@xh/hoist/desktop/cmp/form';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {button} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon';
import {ToolbarPanelModel} from './ToolbarPanelModel';

@HoistComponent()
export class ToolbarPanel extends Component {
    toolBarModel = new ToolbarPanelModel();

    render() {
        return wrapperPanel(
            panel({
                cls: 'xh-toolbox-toolbar-panel',
                title: 'Toolbar Component',
                width: 500,
                height: 400,
                item: this.renderExample()
            })
        );
    }

    renderExample() {
        const model = this.toolBarModel,
            {options} = model;

        return vframe({
            cls: 'xh-toolbox-example-container',
            items: [
                toolbar(
                    button({
                        icon: Icon.chevronLeft(),
                        text: 'Left Aligned'
                    }),
                    toolbarSep(),
                    comboField({
                        options,
                        model,
                        field: 'state',
                        placeholder: 'Select a State...'
                    }),
                    button({
                        text: 'Show Toast',
                        onClick: () => this.showToast()
                    })
                ),
                hframe(
                    toolbar({
                        vertical: true,
                        width: 42,
                        items: [
                            filler(),
                            button({icon: Icon.contact()}),
                            button({icon: Icon.comment()}),
                            toolbarSep(),
                            button({icon: Icon.add()}),
                            button({icon: Icon.delete()}),
                            toolbarSep(),
                            button({icon: Icon.gears()}),
                            filler()
                        ]
                    }),
                    box('Content...')
                ),
                toolbar(
                    filler(),
                    button({
                        rightIcon: Icon.chevronRight(),
                        text: 'Right Aligned'
                    })
                )
            ]
        });
    }

    showToast() {
        XH.toast({
            message: `Selected State: ${this.toolBarModel.state || 'None'}`,
            position: Position.TOP,
            intent: 'primary'
        });
    }
}