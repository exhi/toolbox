import {HoistAppModel, XH} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {positionsPanel} from '../tabs/positions/PositionsPanel';
import {PortfolioService} from '../../core/svc/PortfolioService';
import {tradesPanel} from '../tabs/trades/TradesPanel';
import {positionTradesPanel} from '../widgets/position-trades/PositionTradesPanel';

@HoistAppModel
export class BrowserAppModel {
    tabModel = new TabContainerModel({
        route: 'default',
        switcherPosition: 'none',
        tabs: [
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
                children: [
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