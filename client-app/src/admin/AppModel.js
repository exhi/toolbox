import {AppModel as BaseAppModel} from '@xh/hoist/admin/AppModel';
import {XH} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {PortfolioService} from '../core/svc/PortfolioService';
import {roadmapTab} from './roadmap/RoadmapTab';
import {testsTab} from './tests/TestsTab';
import {wipTab} from './wip/WipTab';

export class AppModel extends BaseAppModel {

    async initAsync() {
        await XH.installServicesAsync(PortfolioService);
    }

    //------------------------
    // Overrides
    //------------------------
    getTabRoutes() {
        return [
            ...super.getTabRoutes(),
            {
                name: 'roadmap',
                path: '/roadmap',
                children: [
                    {name: 'projects', path: '/projects'},
                    {name: 'phases', path: '/phases'}
                ]
            },
            {
                name: 'tests',
                path: '/tests',
                children: [
                    {name: 'asyncLoop', path: '/asyncLoop'},
                    {name: 'cube', path: '/cube'},
                    {name: 'dataView', path: '/dataView'},
                    {name: 'fetchAPI', path: '/fetchAPI'},
                    {name: 'grid', path: '/grid'},
                    {name: 'localDate', path: '/localDate'},
                    {name: 'panelResizing', path: '/panelResizing'},
                    {name: 'select', path: '/select'},
                    {name: 'webSockets', path: '/webSockets'}
                ]
            },
            {
                name: 'wip',
                path: '/wip'
            }
        ];
    }

    createTabs() {
        return [
            ...super.createTabs(),
            {id: 'roadmap', title: 'Roadmap', icon: Icon.mapSigns(), content: roadmapTab},
            {id: 'tests', icon: Icon.stopwatch(), content: testsTab},
            {id: 'wip', title: 'WIP', icon: Icon.experiment(), content: wipTab}
        ];
    }
}
