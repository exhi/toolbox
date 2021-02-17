import {div, vframe} from '@xh/hoist/cmp/layout';
import {hoistCmp} from '@xh/hoist/core/index';
import {Icon} from '@xh/hoist/icon/index';
import {fmtNumber} from '@xh/hoist/format';
import './DataViewItem.scss';

export const dataViewItem = hoistCmp.factory({
    model: null,

    render({record}) {
        const {name, city, value, comment} = record.data,
            loser = value < 0;

        return vframe({
            ref: record.raw.ref,
            className: 'tb-dataview-item',
            items: [
                div(
                    div({
                        className: 'tb-dataview-item__name',
                        item: name
                    }),
                    div({
                        className: 'tb-dataview-item__city',
                        item: city
                    }),
                    div({
                        className: 'tb-dataview-item__value',
                        item: fmtNumber(value, {
                            asElement: true,
                            withSignGlyph: true,
                            colorSpec: true,
                            precision: 2
                        })
                    }),
                    loser ?
                        Icon.skull({size: '3x', className: 'xh-red', prefix: 'fal'}) :
                        Icon.rocket({size: '3x', className: 'xh-green', prefix: 'fal'})    
                ),
                div(comment)
            ]
        });
    }
});
