import {HoistAppModel, XH} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {positionsPanel} from './panels/positions/PositionsPanel';
import {tradesPanel} from './panels/trades/TradesPanel';
import {positionTradesPanel} from './panels/position-trades/PositionTradesPanel';
import {PortfolioService} from '../core/svc/PortfolioService';
import {launcher} from './openfin/Launcher';
import {windowWrapper} from './openfin/WindowWrapper';
import {bindable} from '@xh/hoist/mobx';
import {tradingVolumeChartPanel} from './panels/trading-volume-chart/TradingVolumeChartPanel';

@HoistAppModel
export class AppModel {
    @bindable

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
                content: () => windowWrapper(positionsPanel())
            },
            {
                id: 'trades',
                content: () => windowWrapper(tradesPanel())
            },
            {
                id: 'positionTrades',
                content: () => windowWrapper(positionTradesPanel())
            },
            {
                id: 'tradingVolume',
                content: () => windowWrapper(tradingVolumeChartPanel())
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
                        name: 'tradingVolume',
                        path: '/tradingVolume?:symbol'
                    }
                ]
            }
        ];
    }

    async initAsync() {
        await XH.installServicesAsync(PortfolioService);
    }
}