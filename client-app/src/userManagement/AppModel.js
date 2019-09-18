import {XH, HoistAppModel, RouteSupport} from '@xh/hoist/core';
import {UserService} from './UserService';

@HoistAppModel
export class AppModel {
    async initAsync() {
        await XH.installServicesAsync(UserService);
    }

    getRoutes() {
        return RouteSupport.getRoutes();
    }
}