export declare class AppModel {
    get useCompactGrids(): boolean;
    getAppOptions(): {
        name: string;
        prefName: string;
        formField: {
            label: string;
            item: any;
        };
        reloadRequired: boolean;
    }[];
    initAsync(): Promise<void>;
}
