/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2019 Extremely Heavy Industries Inc.
 */
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {HoistAppModel, loadAllAsync, managed, XH} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';

import {CompanyService} from '../core/svc/CompanyService';
import {PortfolioService} from '../core/svc/PortfolioService';
import {SalesService} from '../core/svc/SalesService';
import {TradeService} from '../core/svc/TradeService';

import {getAppOptions} from './AppOptions';

import {ChartsTab} from './tabs/charts/ChartsTab';
import {ContainersTab} from './tabs/containers/ContainersTab';
import {ExamplesTab} from './tabs/examples/ExamplesTab';
import {FormatsTab} from './tabs/formats/FormatsTab';
import {FormsTab} from './tabs/forms/FormsTab';
import {GridsTab} from './tabs/grids/GridsTab';
import {HomeTab} from './tabs/home/HomeTab';
import {OtherTab} from './tabs/other/OtherTab';
import {PanelsTab} from './tabs/panels/PanelsTab';

@HoistAppModel
export class AppModel {

    @managed
    tabModel = new TabContainerModel({
        route: 'default',
        tabs: [
            {id: 'home', icon: Icon.home(), content: HomeTab},
            {id: 'containers', icon: Icon.box(), content: ContainersTab},
            {id: 'panels', icon: Icon.window(), content: PanelsTab},
            {id: 'grids', icon: Icon.grid(), content: GridsTab},
            {id: 'forms', icon: Icon.edit(), content: FormsTab},
            {id: 'charts', icon: Icon.chartLine(), content: ChartsTab},
            {id: 'formats', icon: Icon.print(), content: FormatsTab},
            {id: 'other', icon: Icon.boxFull(), content: OtherTab},
            {id: 'examples', icon: Icon.books(), content: ExamplesTab}
        ],
        switcherPosition: 'none'
    });

    get useCompactGrids() {
        return XH.getPref('defaultGridMode') == 'COMPACT';
    }

    constructor() {
        this.addReaction(this.trackTabReaction());
    }

    async initAsync() {
        await XH.installServicesAsync(
            CompanyService,
            TradeService,
            SalesService,
            PortfolioService
        );
    }

    async doLoadAsync(loadSpec) {
        await loadAllAsync([], loadSpec);
    }

    getAppOptions() {
        return getAppOptions();
    }

    getRoutes() {
        const isAdmin = XH.getUser().isHoistAdmin;
        return [
            {
                name: 'default',
                path: '/app',
                children: [
                    {
                        name: 'home',
                        path: '/home'
                    },
                    {
                        name: 'containers',
                        path: '/containers',
                        children: [
                            {name: 'hbox', path: '/hbox'},
                            {name: 'vbox', path: '/vbox'},
                            {name: 'tabPanel', path: '/tabPanel'},
                            {name: 'dock', path: '/dock'}
                        ]
                    },
                    {
                        name: 'panels',
                        path: '/panels',
                        children: [
                            {name: 'intro', path: '/intro'},
                            {name: 'toolbars', path: '/toolbars'},
                            {name: 'sizing', path: '/sizing'},
                            {name: 'mask', path: '/mask'},
                            {name: 'loadingIndicator', path: '/loadingIndicator'}
                        ]
                    },
                    {
                        name: 'grids',
                        path: '/grids',
                        children: [
                            {name: 'standard', path: '/standard'},
                            {name: 'tree', path: '/tree?dims'},
                            {name: 'treeWithCheckBox', path: '/treeWithCheckBox'},
                            {name: 'groupedRows', path: '/groupedRows'},
                            {name: 'groupedCols', path: '/groupedCols'},
                            {name: 'rest', path: '/rest'},
                            {name: 'dataview', path: '/dataview'},
                            {name: 'performance', path: '/performance'},
                            {name: 'agGrid', path: '/agGrid'},
                            {name: 'cube', path: '/cube'}
                        ]
                    },
                    {
                        name: 'forms',
                        path: '/forms',
                        children: [
                            {name: 'controls', path: '/controls'},
                            {name: 'validation', path: '/validation'},
                            {name: 'toolbarForm', path: '/toolbarForm'}
                        ]
                    },
                    {
                        name: 'charts',
                        path: '/charts',
                        children: [
                            {name: 'olhc', path: '/olhc'},
                            {name: 'line', path: '/line'}
                        ]
                    },
                    {
                        name: 'formats',
                        path: '/formats',
                        children: [
                            {name: 'number', path: '/number'},
                            {name: 'date', path: '/date'}
                        ]
                    },
                    {
                        name: 'other',
                        path: '/other',
                        children: [
                            {name: 'icons', path: '/icons'},
                            {name: 'leftRightChooser', path: '/leftRightChooser'},
                            {name: 'fileChooser', path: '/fileChooser'},
                            {name: 'timestamp', path: '/timestamp'},
                            {name: 'jsx', path: '/jsx'},
                            {name: 'popups', path: '/popups'}
                        ]
                    },
                    {
                        name: 'examples',
                        path: '/examples',
                        children: [
                            {name: 'portfolio', path: '/portfolio'},
                            {name: 'news', path: '/news'},
                            {name: 'recalls', path: '/recalls'},
                            {name: 'fileManager', path: '/fileManager', omit: !isAdmin}
                        ]
                    }
                ]
            }
        ];
    }

    trackTabReaction() {
        return {
            track: () => this.tabModel.activeTab,
            run: (activeTab) => {
                XH.track({
                    msg: `Viewed ${activeTab.title}`,
                    data: {
                        id: activeTab.id
                    },
                    category: 'Tab'
                });
            }
        };
    }
}
