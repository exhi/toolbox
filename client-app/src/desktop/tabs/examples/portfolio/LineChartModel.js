import {HoistModel, XH} from '@xh/hoist/core';
import {PendingTaskModel} from '@xh/hoist/utils/async';
import {ChartModel} from '@xh/hoist/desktop/cmp/chart';
import Highcharts from 'highcharts/highstock';
import {isNil} from 'lodash';

@HoistModel
export class LineChartModel {

    loadModel = new PendingTaskModel();
    lineChartModel = new ChartModel({
        config: {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Trade Volume over time'
            },
            subtitle: {
                text: 'Click and drag in the plot area to zoom in'
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                enabled: true
            },
            navigator: {
                enabled: true
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'USD'
                }
            },
            legend: {
                enabled: false
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
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
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
            }
        }
    });

    loadData(record) {
        if (!isNil(record)) {
            XH.portfolioService.getLineChartSeries(record.symbol)
                .then(series => {
                    this.lineChartModel.setSeries(series);
                }).linkTo(this.loadModel);
        } else {
            this.lineChartModel.setSeries([]);
        }
    }
}