import {HoistAppModel, XH} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {positionsPanel} from './panels/positions/PositionsPanel';
import {tradesPanel} from './panels/trades/TradesPanel';
import {positionTradesPanel} from './panels/position-trades/PositionTradesPanel';
import {PortfolioService} from '../core/svc/PortfolioService';
import {launcher} from './openfin/Launcher';

@HoistAppModel
export class AppModel {
    tabModel = new TabContainerModel({
        route: 'default',
        switcherPosition: 'none',
        tabs: [
            {
                id: 'home',
                content: () => 'Welcome Home!'
            },
            {
                id: 'launcher',
                content: () => launcher()
            },
            {
                id: 'positions',
                content: () => positionsPanel()
            },
            {
                id: 'trades',
                content: () => tradesPanel()
            },
            {
                id: 'positionTrades',
                title: 'Position Trades',
                content: () => positionTradesPanel()
            },
            {
                id: 'positionCharts',
                title: 'Position Charts',
                content: () => null
            }
        ]
    });

    getRoutes() {
        return [
            {
                name: 'default',
                path: '/dashboard',
                forwardTo: 'default.home',
                children: [
                    {
                        name: 'home',
                        path: '/'
                    },
                    {
                        name: 'launcher',
                        path: '/launcher'
                    },
                    {
                        name: 'positions',
                        path: '/positions'
                    },
                    {
                        name: 'trades',
                        path: '/trades'
                    },
                    {
                        name: 'positionTrades',
                        path: '/positionTrades?:positionId'
                    },
                    {
                        name: 'positionCharts',
                        path: '/positionCharts?:positionId'
                    }
                ]
            }
        ];
    }

    async initAsync() {
        await XH.installServicesAsync(PortfolioService);
    }
}