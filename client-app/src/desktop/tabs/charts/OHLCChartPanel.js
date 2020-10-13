import {creates, hoistCmp, XH} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {div, filler, span, hframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {numberInput, select} from '@xh/hoist/desktop/cmp/input';
import {chart} from '@xh/hoist/cmp/chart';
import {button} from '@xh/hoist/desktop/cmp/button/index';
import {OHLCChartModel} from './OHLCChartModel';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';

export const ohlcChartPanel = hoistCmp.factory({
    model: creates(OHLCChartModel),

    render({model}) {
        return div({
            style: {  
                width: '75%',
                margin: 'auto'
                // display: 'flex',
                // position: 'relative',
                // flex: '1 1 auto'
            },
            item: panel({
                tbar: tbar(),
                title: 'Charts › 4 Charts Autosized',
                icon: Icon.chartLine(),
                items: [
                    hframe(
                        chart({
                            model: model.chartModel1
                        }), 
                        chart({
                            model: model.chartModel2
                        })
                    ),
                    hframe(
                        chart({
                            model: model.chartModel3
                        }),
                        chart({
                            model: model.chartModel4
                        })
                    )
                ]
            })
        }

        );
    }
});


const tbar = hoistCmp.factory(
    ({model}) => toolbar(
        span('Symbol: '),
        select({
            bind: 'currentSymbol',
            options: model.symbols,
            enableFilter: false,
            width: 120
        }),
        toolbarSep(),
        span('Aspect Ratio: '),
        numberInput({
            width: 50,
            bind: 'aspectRatio',
            commitOnChange: true,
            selectOnFocus: true,
            min: 0
        }),
        filler(),
        button({
            text: 'Call chart API',
            icon: Icon.code(),
            disabled: !model.chartModel1.highchart,
            onClick: () => {
                const xExtremes = model.chartModel1.highchart.axes[0].getExtremes();
                XH.alert({
                    title: 'X-axis extremes - as read from chart API',
                    message: JSON.stringify(xExtremes)
                });
            }
        })
    )
);
