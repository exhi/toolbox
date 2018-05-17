/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {Component} from 'react';
import {HoistComponent} from 'hoist/core';
import {box, hframe, vframe, filler} from 'hoist/cmp/layout';
import {wrapperPanel} from '../impl/WrapperPanel';
import {comboField} from 'hoist/cmp/form';
import {toolbar, toolbarSep} from 'hoist/cmp/toolbar';
import {panel} from 'hoist/cmp/panel';
import {ToastManager} from 'hoist/toast';
import {button, Position} from 'hoist/kit/blueprint';
import {Icon} from 'hoist/icon';
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
        ToastManager.show({
            message: `Selected State: ${this.toolBarModel.state || 'None'}`,
            position: Position.TOP,
            intent: 'primary'
        });
    }
}