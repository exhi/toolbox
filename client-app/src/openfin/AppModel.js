import {HoistAppModel} from '@xh/hoist/core';

@HoistAppModel
export class AppModel {

    async initAsync() {
        window.fin.Window.getCurrentSync().showDeveloperTools();
    }
}