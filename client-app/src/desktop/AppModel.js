/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import {XH} from '@xh/hoist/core';
import {HoistAppModel} from '@xh/hoist/app';
import {TabContainerModel} from '@xh/hoist/cmp/tab';
import {FeedbackDialogModel} from '@xh/hoist/cmp/feedback';

import {HomePanel} from './tabs/home/HomePanel';
import {CandleChartPanel} from './tabs/charts/CandleChartPanel';
import {LeftRightChooserPanel} from './tabs/components/LeftRightChooserPanel';
import {MaskPanel} from './tabs/components/MaskPanel';
import {LoadMaskPanel} from './tabs/components/LoadMaskPanel';
import {ToolbarPanel} from './tabs/components/ToolbarPanel';
import {MessagesPanel} from './tabs/components/MessagesPanel';
import {HBoxContainerPanel} from './tabs/containers/HBoxContainerPanel';
import {VBoxContainerPanel} from './tabs/containers/VBoxContainerPanel';
import {ResizableContainerPanel} from './tabs/containers/ResizableContainerPanel';
import {TabPanelContainerPanel} from './tabs/containers/TabPanelContainerPanel';
import {FormFieldsPanel} from './tabs/forms/FormFieldsPanel';
import {StandardGridPanel} from './tabs/grids/StandardGridPanel';
import {GroupedGridPanel} from './tabs/grids/GroupedGridPanel';
import {RestGridPanel} from './tabs/grids/RestGridPanel';
import {IconsPanel} from './tabs/icons/IconsPanel';

@HoistAppModel
export class AppModel {

    feedbackModel = new FeedbackDialogModel();
    tabs = this.createTabContainer();
    loginMessage = "User: 'toolbox@xh.io' / Password: 'toolbox'";

    get enableLogout() {return true}

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
    createTabContainer() {
        return new TabContainerModel({
            id: 'default',
            useRoutes: true,
            orientation: 'h',
            children: this.createTabs()
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
                forwardTo: 'default.charts.candle',
                children: [
                    {name: 'candle', path: '/candle'}
                ]
            },
            {
                name: 'components',
                path: '/components',
                forwardTo: 'default.components.leftRightChooser',
                children: [
                    {name: 'leftRightChooser', path: '/leftRightChooser'},
                    {name: 'maskPanel', path: '/mask'},
                    {name: 'loadMask', path: '/loadMask'},
                    {name: 'toolbar', path: '/toolbar'},
                    {name: 'messages', path: '/messages'}
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
                    {name: 'rest', path: '/rest'}
                ]
            },
            {
                name: 'icons',
                path: '/icons'
            }
        ];
    }

    createTabs() {
        return [
            {
                id: 'home',
                component: HomePanel
            },
            {
                id: 'charts',
                orientation: 'v',
                children: [
                    {id: 'candle', component: CandleChartPanel}
                ]
            },
            {
                id: 'components',
                orientation: 'v',
                children: [
                    {id: 'leftRightChooser', name: 'LeftRightChooser', component: LeftRightChooserPanel},
                    {id: 'maskPanel', name: 'Mask', component: MaskPanel},
                    {id: 'loadMask', name: 'LoadMask', component: LoadMaskPanel},
                    {id: 'toolbar', component: ToolbarPanel},
                    {id: 'messages', component: MessagesPanel}
                ]
            },
            {
                id: 'containers',
                orientation: 'v',
                children: [
                    {id: 'hbox', name: 'HBox', component: HBoxContainerPanel},
                    {id: 'vbox', name: 'VBox', component: VBoxContainerPanel},
                    {id: 'resizable', component: ResizableContainerPanel},
                    {id: 'tabPanel', name: 'TabPanel', component: TabPanelContainerPanel}
                ]
            },
            {
                id: 'forms',
                component: FormFieldsPanel
            },
            {
                id: 'grids',
                orientation: 'v',
                children: [
                    {id: 'standard', component: StandardGridPanel},
                    {id: 'grouped', component: GroupedGridPanel},
                    {id: 'rest', component: RestGridPanel}
                ]
            },
            {
                id: 'icons',
                component: IconsPanel
            }
        ];
    }

    destroy() {
        XH.safeDestroy(this.feedbackModel, this.tabs);
    }

}