/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {XH, HoistApp} from '@xh/hoist/core';
import {TabContainerModel} from '@xh/hoist/desktop/cmp/tab';

import {AppContainer} from '@xh/hoist/desktop/appcontainer';
import {AppComponent} from './AppComponent';

import {ChartsTab} from './tabs/charts/ChartsTab';
import {ComponentsTab} from './tabs/components/ComponentsTab';
import {ContainersTab} from './tabs/containers/ContainersTab';
import {FormsTab} from './tabs/forms/FormsTab';
import {GridsTab} from './tabs/grids/GridsTab';
import {IconsTab} from './tabs/icons/IconsTab';

@HoistApp
class AppClass {

    tabModel = this.createTabModel();
    loginMessage = "User: 'toolbox@xh.io' / Password: 'toolbox'";

    get enableLogout() {return true}
    get componentClass() {return AppComponent}
    get containerClass() {return AppContainer}


    checkAccess(user) {
        const role = 'APP_READER',
            hasAccess = user.hasRole(role),
            message = hasAccess ? '' : `Role "${role}" is required to use this application.`;
        return {hasAccess, message};
    }

    async initAsync() {
        XH.track({msg: 'Loaded App'});
    }

    getRoutes() {
        return [
            {
                name: 'default',
                path: '/app',
                forwardTo: 'default.home',
                children: this.getTabRoutes()
            }
        ];
    }

    //------------------------
    // Implementation
    //------------------------
    createTabModel() {
        return new TabContainerModel({
            route: 'default',
            tabs: [
                {id: 'containers', content: ContainersTab},
                {id: 'grids', content: GridsTab},
                {id: 'forms', content: FormsTab},
                {id: 'components', title: 'Other Components', content: ComponentsTab},
                {id: 'charts', content: ChartsTab},
                {id: 'icons', content: IconsTab}
            ]
        });
    }

    //------------------------
    // For override / extension
    //------------------------
    getTabRoutes() {
        return [
            {
                name: 'home',
                path: '/home'
            },
            {
                name: 'charts',
                path: '/charts',
                forwardTo: 'default.charts.olhc',
                children: [
                    {name: 'olhc', path: '/olhc'},
                    {name: 'line', path: '/line'}
                ]
            },
            {
                name: 'components',
                path: '/components',
                forwardTo: 'default.components.toolbar',
                children: [
                    {name: 'toolbar', path: '/toolbar'},
                    {name: 'leftRightChooser', path: '/leftRightChooser'},
                    {name: 'showMask', path: '/mask'},
                    {name: 'loadMask', path: '/loadMask'},
                    {name: 'timestamp', path: '/timestamp'}
                ]
            },
            {
                name: 'containers',
                path: '/containers',
                forwardTo: 'default.containers.hbox',
                children: [
                    {name: 'hbox', path: '/hbox'},
                    {name: 'vbox', path: '/vbox'},
                    {name: 'resizable', path: '/resizable'},
                    {name: 'tabPanel', path: '/tabPanel'}
                ]
            },
            {
                name: 'forms',
                path: '/forms'
            },
            {
                name: 'grids',
                path: '/grids',
                forwardTo: 'default.grids.standard',
                children: [
                    {name: 'standard', path: '/standard'},
                    {name: 'grouped', path: '/grouped'},
                    {name: 'rest', path: '/rest'},
                    {name: 'dataview', path: '/dataview'}
                ]
            },
            {
                name: 'icons',
                path: '/icons'
            }
        ];
    }

    destroy() {
        XH.safeDestroy(this.tabs);
    }
}
export const App = new AppClass();