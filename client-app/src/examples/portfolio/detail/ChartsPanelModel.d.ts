import { LineChartModel } from './LineChartModel';
import { OHLCChartModel } from './OHLCChartModel';
export declare class ChartsPanelModel {
    symbol: any;
    lineChartModel: LineChartModel;
    ohlcChartModel: OHLCChartModel;
    constructor();
    doLoadAsync(loadSpec: any): Promise<void>;
}
