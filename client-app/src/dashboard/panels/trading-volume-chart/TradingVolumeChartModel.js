import {HoistModel, managed, XH, LoadSupport} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {ChartModel} from '@xh/hoist/desktop/cmp/chart';
import {fmtDate} from '@xh/hoist/format';
import {Highcharts} from '@xh/hoist/kit/highcharts';
import {isNil} from 'lodash';
import {convertIconToSvg, Icon} from '@xh/hoist/icon';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {SyncSupport, sync} from '@xh/hoist/openfin';

@HoistModel
@LoadSupport
@SyncSupport('trades')
export class TradingVolumeChartModel {
    @bindable @sync symbol;

    @managed
    chartModel = new ChartModel({
        highchartsConfig: {
            chart: {
                zoomType: 'x',
                animation: false
            },
            title: {text: null},
            tooltip: {outside: true},
            legend: {enabled: false},
            scrollbar: {enabled: false},
            rangeSelector: {enabled: false},
            navigator: {enabled: true},
            xAxis: {
                type: 'datetime',
                labels: {
                    formatter: function() {
                        return fmtDate(this.value, {fmt: 'DD-MMM-YY'});
                    }
                }
            },
            yAxis: {
                floor: 0,
                title: {
                    text: null
                }
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [
                                1,
                                Highcharts.Color(Highcharts.getOptions().colors[0])
                                    .setOpacity(0)
                                    .get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            exporting: {
                enabled: true
            }
        }
    });

    /** @member {OpenFinWindowModel} */
    openFinWindowModel;

    /*
    @managed
    syncModel = new SyncModel({
        syncId: 'trades',
        target: this,
        properties: [
            {
                name: 'symbol'
            }
        ]
    });
    */

    constructor() {
        this.addReaction({
            track: () => XH.routerState,
            run: this.syncWithRouterState,
            fireImmediately: true
        });

        this.addReaction({
            track: () => this.symbol,
            run: () => this.loadAsync()
        });
    }

    async initAsync({openFinWindowModel}) {
        if (isRunningInOpenFin()) {
            this.openFinWindowModel = openFinWindowModel;
            this.openFinWindowModel.setIcon(convertIconToSvg(Icon.chartLine()));
        }
    }

    syncWithRouterState() {
        const {routerState} = XH;
        if (!routerState.name.endsWith('tradingVolume')) return;

        const {params} = routerState,
            {symbol} = params;

        this.setSymbol(symbol);
    }

    async doLoadAsync(loadSpec) {
        const {symbol} = this;

        // Make sure the route params match the current state of the widget
        XH.router.navigate('default.tradingVolume', {symbol}, {replace: true});

        if (isNil(symbol)) {
            this.chartModel.setSeries([]);
            return;
        }

        const series = await XH.portfolioService.getLineChartSeriesAsync(symbol);
        this.chartModel.setSeries([series]);

        if (this.openFinWindowModel) {
            this.openFinWindowModel.setTitle(`${symbol} Trading Volume`);
        }
    }
}