import {Component} from 'react';
import {XH, HoistComponent, elemFactory} from '@xh/hoist/core';
import {page} from '@xh/hoist/mobile/cmp/page';
import {grid} from '@xh/hoist/cmp/grid';
import {toolbar} from '@xh/hoist/mobile/cmp/toolbar';
import {filler} from '@xh/hoist/cmp/layout';
import {colChooserButton} from '@xh/hoist/mobile/cmp/button';
import {Icon} from '@xh/hoist/icon';

import {GridPageModel} from './GridPageModel';

@HoistComponent
export class GridPage extends Component {

    model = new GridPageModel();

    render() {
        const {model} = this,
            {gridModel, loadModel} = model;

        return page({
            title: 'Grids',
            icon: Icon.gridPanel(),
            mask: loadModel,
            item: grid({
                model: gridModel,
                onRowClicked: (e) => {
                    const {id} = e.data.raw;
                    XH.appendRoute('gridDetail', {id});
                }
            }),
            bbar: toolbar(
                filler(),
                colChooserButton({
                    text: 'Choose Columns',
                    model: gridModel
                })
            )
        });
    }
}
export const gridPage = elemFactory(GridPage);