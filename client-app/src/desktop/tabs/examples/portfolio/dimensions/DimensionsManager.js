import {Component} from 'react';
import {HoistComponent, elemFactory} from '@xh/hoist/core/index';
import {panel} from '@xh/hoist/desktop/cmp/panel/index';
import {grid} from '@xh/hoist/cmp/grid/index';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar/index';
import {button} from '@xh/hoist/desktop/cmp/button/index';
import {Icon} from '@xh/hoist/icon/Icon';
import {filler, fragment} from '@xh/hoist/cmp/layout/index';
import {dimensionsEditor} from './DimensionsEditor';

import './DimensionsManager.scss';

@HoistComponent
export class DimensionsManager extends Component {

    render() {
        const {model, agOptions} = this;
        return fragment(
            panel({
                className: 'dimensions-manager',
                tbar: this.renderToolbar(),
                items: [
                    grid({
                        model: model.gridModel,
                        agOptions
                    })
                ]
            }),
            dimensionsEditor({model: model.editorModel})
        );
    }

    agOptions = {
        headerHeight: 0
    };

    renderToolbar() {
        const {model} = this;
        return toolbar({
            className: 'dimensions-manager__toolbar',
            items: [
                filler(),
                button({
                    icon: Icon.add(),
                    onClick: () => model.openEditor()
                }),
                button({
                    icon: Icon.edit(),
                    onClick: () => model.openEditor(model.selectedDimensions),
                    disabled: model.isSelectionProtected
                }),
                button({
                    icon: Icon.delete(),
                    onClick: () => model.deleteDimensions(model.selection),
                    disabled: model.isSelectionProtected
                })
            ]
        });
    }
}

export const dimensionsManager = elemFactory(DimensionsManager);

