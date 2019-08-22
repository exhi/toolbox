import {HoistAppModel, XH} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {positionsPanel} from '../tabs/positions/PositionsPanel';
import {PortfolioService} from '../../core/svc/PortfolioService';

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
                content: () => null
            },
            {
                id: 'positionsDetailsWidget',
                title: 'Position Details',
                content: () => null
            },
            {
                id: 'winnersLosersWidget',
                title: 'Winners/Losers',
                content: () => null
            },
            {
                id: 'tradingVolumeWidget',
                title: 'Trading Volume',
                content: () => null
            },
            {
                id: 'priceHistoryWidget',
                title: 'Price History',
                content: () => null
            }
        ]
    });

    async initAsync() {
        await XH.installServicesAsync(PortfolioService);
    }

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
                    }
                ]
            }
        ];
    }
}