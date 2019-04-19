import {Component} from 'react';
import {elemFactory, HoistComponent} from '@xh/hoist/core';
import {vbox, hbox} from '@xh/hoist/cmp/layout/index';
import {dialog} from '@xh/hoist/kit/blueprint/index';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon';
import {withDefault} from '@xh/hoist/utils/js';
import {select} from '@xh/hoist/desktop/cmp/input';
import {size, isEmpty} from 'lodash';

import './DimensionsEditor.scss';

@HoistComponent
export class DimensionsEditor extends Component {

    baseClassName = 'xh-dim-chooser';

    INDENT = 10;        // Indentation applied at each level.
    X_BTN_WIDTH = 26;   // Width of 'x' buttons.
    LEFT_PAD = 5;       // Left-padding for inputs.

    get popoverWidth() {
        return withDefault(this.props.popoverWidth, 250);
    }

    get buttonWidth() {
        return withDefault(this.props.buttonWidth, 220);
    }

    render() {
        const {isOpen} = this.model;

        return dialog({
            title: 'Create Custom Grouping',
            className: 'dimension-editor',
            transitionName: 'none',
            isOpen,
            isCloseButtonShown: false,
            item: this.renderEditMenu()
        });
    }

    //--------------------
    // Event Handlers
    //--------------------
    onDimChange = (dim, i) => {
        this.model.addPendingDim(dim, i);
    }

    renderEditMenu() {
        return vbox({
            items: [
                this.renderSelectEditors(),
                buttonGroup({
                    className: 'dimension-editor__nav-row',
                    items: [
                        button({
                            icon: Icon.x(),
                            flex: 1,
                            onClick: () => this.model.setIsOpen(false)
                        }),
                        button({
                            icon: Icon.check({className: 'xh-green'}),
                            flex: 2,
                            onClick: () => this.model.commitPendingValueAndClose()
                        })
                    ]
                })
            ]
        });
    }


    //--------------------
    // Render popover items
    //--------------------
    renderSelectEditors() {
        const {LEFT_PAD, INDENT, X_BTN_WIDTH, model} = this,
            {pendingValue, dimensions, maxDepth, leafInPending} = model;

        let children = pendingValue.map((dim, i) => {
            const options = model.dimOptionsForLevel(i),
                marginLeft = LEFT_PAD + (INDENT * i),
                width = this.popoverWidth - marginLeft - X_BTN_WIDTH;

            return hbox({
                className: 'dimension-editor__select-row',
                items: [
                    select({
                        options,
                        value: dimensions[dim].label,
                        disabled: isEmpty(options),
                        enableFilter: false,
                        width,
                        marginLeft,
                        onChange: (newDim) => this.onDimChange(newDim, i)
                    }),
                    button({
                        icon: Icon.x({className: 'xh-red'}),
                        maxWidth: X_BTN_WIDTH,
                        minWidth: X_BTN_WIDTH,
                        disabled: pendingValue.length === 1,
                        onClick: () => model.removePendingDim(dim)
                    })
                ]
            });
        });

        const atMaxDepth = (pendingValue.length === Math.min(maxDepth, size(dimensions)));
        if (!atMaxDepth && !leafInPending) {
            children.push(this.renderAddButtonOrSelect());
        }

        return vbox({
            className: 'dimension-editor__selects',
            items: children
        });
    }

    renderAddButtonOrSelect() {
        const {model, LEFT_PAD, INDENT, X_BTN_WIDTH} = this,
            {pendingValue} = model,
            pendingCount = pendingValue.length,
            marginLeft = LEFT_PAD + (pendingCount * INDENT),
            width = this.popoverWidth - marginLeft - X_BTN_WIDTH;

        return model.showAddSelect ?
            select({
                options: model.dimOptionsForLevel(pendingCount),
                enableFilter: false,
                autoFocus: true,
                openMenuOnFocus: true,
                width,
                marginLeft,
                onChange: (newDim) => this.onDimChange(newDim, pendingCount)
            }) :
            button({
                text: 'Add grouping...',
                icon: Icon.add({className: 'xh-green'}),
                width,
                marginLeft,
                onClick: () => this.model.setShowAddSelect(true)
            });
    }

}
export const dimensionsEditor = elemFactory(DimensionsEditor);