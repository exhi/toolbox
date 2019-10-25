export declare class AppModel {
    renderMode: string;
    readonly useCompactGrids: boolean;
    getAppOptions(): ({
        name: string;
        formField: {
            item: any;
            label?: undefined;
        };
        valueGetter: () => string;
        valueSetter: (v: any) => any;
        prefName?: undefined;
        reloadRequired?: undefined;
    } | {
        name: string;
        prefName: string;
        formField: {
            label: string;
            item: any;
        };
        reloadRequired: boolean;
        valueGetter?: undefined;
        valueSetter?: undefined;
    })[];
    initAsync(): Promise<void>;
}
