import {hoistComponent, HoistModel, useLocalModel} from '@xh/hoist/core';
import {hbox, filler} from '@xh/hoist/cmp/layout';
import {tabbing} from 'openfin-layouts';
import {action, bindable} from '@xh/hoist/mobx';
import {tabs as bpTabs, tab as bpTab} from '@xh/hoist/kit/blueprint';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {button} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon';

import './TabStrip.scss';

export const [TabStrip, tabStrip] = hoistComponent(function TabStrip(props) {
    const model = useLocalModel(TabStripModel),
        {tabs, activeTab} = model;

    return hbox({
        id: 'tabs-container',
        className: 'tabstrip',
        items: [
            bpTabs({
                id: 'tabs',
                selectedTabId: activeTab.id,
                animate: false,
                onChange: (tabId) => model.activateTab(tabId),
                items: tabs.map(tab => bpTab({
                    id: tab.id,
                    title: tab.title
                }))
            }),
            filler(),
            button({
                icon: Icon.minimize(),
                onClick: () => model.minimizeAsync()
            }),
            button({
                // omit: windowState !== WindowState.NORMAL,
                icon: Icon.expand(),
                onClick: () => model.maximizeAsync()
            }),
            button({
                // omit: windowState !== WindowState.MAXIMIZED,
                icon: Icon.collapse(),
                onClick: () => model.restoreAsync()
            }),
            button({
                icon: Icon.close(),
                intent: 'danger'
                // onClick: () => closeWindow()
            })
        ]
    });
});

class Tab {
    /** @member {WindowIdentity} */
    windowIdentity;

    /** @member {TabProperties} */
    properties;

    get id() {
        return Tab.getTabId(this.windowIdentity);
    }

    get title() {
        return this.properties.title;
    }

    constructor(windowIdentity, properties) {
        this.windowIdentity = windowIdentity;
        this.properties = properties;
    }

    /**
     * @param {WindowIdentity} windowIdentity
     * @returns {string}
     */
    static getTabId(windowIdentity) {
        const {uuid, name} = windowIdentity;
        return `${uuid}_${name}`;
    }
}

@HoistModel
class TabStripModel {
    /** @member {Tab} */
    @bindable activeTab;

    /** @member {Tab[]} */
    @bindable.ref tabs = [];

    constructor() {
        this.registerListeners();

        if (!isRunningInOpenFin()) {
            this.setTabs([
                new Tab({uuid: 'test', name: 'tab1'}, {title: 'Tab 1'}),
                new Tab({uuid: 'test', name: 'tab2'}, {title: 'Tab 2'}),
                new Tab({uuid: 'test', name: 'tab3'}, {title: 'Tab 3'})
            ]);

            this.setActiveTab(this.tabs[1]);
        }
    }

    destroy() {
        this.destroyListeners();
    }

    @action
    activateTab(tabId) {
        this.activeTab = this.tabs.find(it => it.id === tabId);
    }

    // ------------------------------------------
    // Implementation

    findTabByIdentity(windowIdentity) {
        return this.tabs.find(it => it.id === Tab.getTabId(windowIdentity));
    }

    @action
    addTab(windowIdentity, properties, index) {
        const tabs = [...this.tabs];
        tabs.splice(index, 0, new Tab(windowIdentity, properties));
        this.tabs = tabs;
    }

    @action
    removeTab(windowIdentity) {
        this.tabs = this.tabs.filter(it => it.id === Tab.getTabId(windowIdentity));
    }

    /** @param {TabActivatedEvent} event */
    onTabActivated = (event) => {
        this.setActiveTab(this.findTabByIdentity(event.identity));
    };

    /** @param {TabAddedEvent} event */
    onTabAdded = (event) => {
        this.addTab(event.identity, event.properties, event.index);
    };

    /** @param {TabRemovedEvent} event */
    onTabRemoved = (event) => {
        this.removeTab(event.identity);
    };

    registerListeners() {
        this.addEventListener('tab-added', this.onTabAdded);
        this.addEventListener('tab-removed', this.onTabRemoved);
        this.addEventListener('tab-activated', this.onTabActivated);
    }

    destroyListeners() {
        this.removeEventListener('tab-added', this.onTabAdded);
        this.removeEventListener('tab-removed', this.onTabRemoved);
        this.removeEventListener('tab-activated', this.onTabActivated);
    }

    addEventListener(event, listener) {
        if (!isRunningInOpenFin()) return;
        tabbing.addEventListener(event, listener);
    }

    removeEventListener(event, listener) {
        if (!isRunningInOpenFin()) return;
        tabbing.removeEventListener(event, listener);
    }
}
