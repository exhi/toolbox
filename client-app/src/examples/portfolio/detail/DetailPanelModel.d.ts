import { OrdersPanelModel } from './OrdersPanelModel';
import { ChartsPanelModel } from './ChartsPanelModel';
export declare class DetailPanelModel {
    positionId: any;
    ordersPanelModel: OrdersPanelModel;
    chartsPanelModel: ChartsPanelModel;
    panelSizingModel: any;
    constructor();
    doLoadAsync(loadSpec: any): Promise<void>;
}
