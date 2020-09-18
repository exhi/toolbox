/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2020 Extremely Heavy Industries Inc.
 */
import {HoistAppModel, loadAllAsync, managed, XH} from '@xh/hoist/core';
import {NavigatorModel} from '@xh/hoist/mobile/cmp/navigator';
import {AppMenuModel} from '@xh/hoist/mobile/cmp/header';
import {required} from '@xh/hoist/cmp/form';
import {select, switchInput} from '@xh/hoist/mobile/cmp/input';
import {PortfolioService} from '../core/svc/PortfolioService';
import {homePage} from './home/HomePage';
import {gridPage} from './grids/GridPage';
import {gridDetailPage} from './grids/GridDetailPage';
import {panelsPage} from './panels/PanelsPage';
import {treeGridPage} from './treegrids/TreeGridPage';
import {treeGridDetailPage} from './treegrids/TreeGridDetailPage';
import {dataViewPage} from './dataview/DataViewPage';
import {formPage} from './form/FormPage';
import {containersPage} from './containers/ContainersPage';
import {popupsPage} from './popups/PopupsPage';
import {iconPage} from './icons/IconPage';
import {pinPadPage} from './pinPad/PinPadPage';

@HoistAppModel
export class AppModel {

    @managed
    appMenuModel = new AppMenuModel();

    @managed
    navigatorModel = new NavigatorModel({
        pages: [
            {id: 'default', content: homePage},
            {id: 'grids', content: gridPage},
            {id: 'gridDetail', content: gridDetailPage},
            {id: 'treegrids', content: treeGridPage},
            {id: 'treeGridDetail', content: treeGridDetailPage},
            {id: 'dataview', content: dataViewPage},
            {id: 'form', content: formPage},
            {id: 'containers', content: containersPage},
            {id: 'panels', content: panelsPage},
            {id: 'popups', content: popupsPage},
            {id: 'icons', content: iconPage},
            {id: 'pinPad', content: pinPadPage}
        ]
    });

    getRoutes() {
        return [
            {
                name: 'default',
                path: '/mobile',
                children: [
                    {
                        name: 'grids',
                        path: '/grids',
                        children: [{
                            name: 'gridDetail',
                            path: '/:id<\\d+>'
                        }]
                    },
                    {
                        name: 'treegrids',
                        path: '/treegrids',
                        children: [{
                            name: 'treeGridDetail',
                            path: '/:id'
                        }]
                    },
                    {
                        name: 'dataview',
                        path: '/dataview'
                    },
                    {
                        name: 'form',
                        path: '/form'
                    },
                    {
                        name: 'containers',
                        path: '/containers'
                    },
                    {
                        name: 'panels',
                        path: '/panels'
                    },
                    {
                        name: 'popups',
                        path: '/popups'
                    },
                    {
                        name: 'icons',
                        path: '/icons'
                    },
                    {
                        name: 'pinPad',
                        path: '/pinPad'
                    }
                ]
            }
        ];
    }

    getAppOptions() {
        return [
            {
                name: 'theme',
                formField: {
                    item: select({
                        options: [
                            {value: 'light', label: 'Light'},
                            {value: 'dark', label: 'Dark'}
                        ]
                    })
                },
                fieldModel: {
                    rules: [required]
                },
                valueGetter: () => XH.darkTheme ? 'dark' : 'light',
                valueSetter: (v) => XH.acm.themeModel.setDarkTheme(v == 'dark')
            },
            {
                name: 'autoRefresh',
                prefName: 'xhAutoRefreshEnabled',
                formField: {
                    label: 'Auto-refresh',
                    info: `Enable to auto-refresh app data every ${XH.autoRefreshService.interval} seconds`,
                    item: switchInput()
                }
            }
        ];
    }

    async initAsync() {
        await XH.installServicesAsync(PortfolioService);
    }

    async doLoadAsync(loadSpec) {
        await loadAllAsync([], loadSpec);
    }
}
