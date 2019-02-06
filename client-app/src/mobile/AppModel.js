/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {XH, HoistAppModel, managed} from '@xh/hoist/core';
import {NavigatorModel} from '@xh/hoist/mobile/cmp/navigator';
import {AppMenuModel} from '@xh/hoist/mobile/cmp/header';
import {required} from '@xh/hoist/cmp/form';
import {select} from '@xh/hoist/mobile/cmp/input';

import {PortfolioService} from '../core/svc/PortfolioService';

import {HomePage} from './home/HomePage';
import {GridPage} from './grids/GridPage';
import {TreeGridPage} from './grids/TreeGridPage';
import {FormPage} from './form/FormPage';
import {ContainersPage} from './containers/ContainersPage';
import {PopupsPage} from './popups/PopupsPage';
import {IconPage} from './icons/IconPage';

@HoistAppModel
export class AppModel {

    @managed
    appMenuModel = new AppMenuModel();

    @managed
    navigatorModel = new NavigatorModel({
        routes: [
            {
                route: 'default',
                title: 'Toolbox',
                content: HomePage
            },
            {
                route: 'grids',
                title: 'Grids',
                content: GridPage
            },
            {
                route: 'treegrids',
                title: 'Tree Grids',
                content: TreeGridPage
            },
            {
                route: 'form',
                title: 'Form',
                content: FormPage
            },
            {
                route: 'containers',
                title: 'Containers',
                content: ContainersPage
            },
            {
                route: 'popups',
                title: 'Popups',
                content: PopupsPage
            },
            {
                route: 'icons',
                title: 'Icons',
                content: IconPage
            }
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
                        path: '/grids'
                    },
                    {
                        name: 'treegrids',
                        path: '/treegrids'
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
                        name: 'popups',
                        path: '/popups'
                    },
                    {
                        name: 'icons',
                        path: '/icons'
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
            }
        ];
    }

    appendRoute(...args) {
        this.navigatorModel.appendRoute(...args);
    }

    async initAsync() {
        await XH.installServicesAsync(PortfolioService);
    }
}