import {Component} from 'react';
import {HoistComponent, elemFactory} from '@xh/hoist/core';
import {div} from '@xh/hoist/cmp/layout';
import {page} from '@xh/hoist/mobile/cmp/page';
import {numberRenderer} from '@xh/hoist/format';
import {capitalize} from 'lodash';
import {Icon} from '@xh/hoist/icon';

import {TreeGridDetailPageModel} from './TreeGridDetailPageModel';

@HoistComponent
export class TreeGridDetailPage extends Component {

    constructor(props) {
        super(props);
        const {id} = props;
        this.model = new TreeGridDetailPageModel({id});
    }

    render() {
        const {record, loadModel} = this.model;

        return page({
            title: record ? this.renderPageTitle(record) : null,
            icon: Icon.portfolio(),
            mask: loadModel,
            className: 'toolbox-detail-page',
            item: record ? this.renderRecord(record) : null
        });
    }

    renderPageTitle(record) {
        const lastPart = record.id.split('>>').pop();
        return lastPart.split(':').pop();
    }

    renderRecord(record) {
        return div(
            // Split id to extract drilldown information
            ...record.id.split('>>').map(it => {
                if (it === 'root') return null;
                const parts = it.split(':');
                return this.renderRow(capitalize(parts[0]), parts[1]);
            }),

            this.renderRow('Market Value', record.mktVal, numberRenderer({precision: 0, ledger: true, asElement: true})),
            this.renderRow('P&L', record.pnl, numberRenderer({precision: 0, ledger: true, colorSpec: true, asElement: true}))
        );
    }

    renderRow(title, value, renderer) {
        return div({
            className: 'toolbox-detail-row',
            items: [
                div(title),
                div(renderer ? renderer(value) : value)
            ]
        });
    }
}

export const treeGridDetailPage = elemFactory(TreeGridDetailPage);