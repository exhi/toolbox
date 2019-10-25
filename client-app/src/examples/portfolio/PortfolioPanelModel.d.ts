import { GridPanelModel } from './GridPanelModel';
import { MapPanelModel } from './MapPanelModel';
import { DetailPanelModel } from './detail/DetailPanelModel';
export declare class PortfolioPanelModel {
    session: any;
    dimChooserModel: any;
    store: any;
    gridPanelModel: GridPanelModel;
    mapPanelModel: MapPanelModel;
    detailPanelModel: DetailPanelModel;
    readonly selectedPosition: any;
    constructor();
    doLoadAsync(loadSpec: any): Promise<void>;
    selectedPositionReaction(): {
        track: () => any;
        run: (position: any) => void;
        delay: number;
    };
    dimensionChooserReaction(): {
        track: () => any;
        run: () => any;
    };
    createStore(): any;
    createDimChooserModel(): any;
}
