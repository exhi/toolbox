import {HoistModel} from '@xh/hoist/core';
import {action, bindable} from '@xh/hoist/mobx';
import {tabbing, tabstrip} from 'openfin-layouts';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';

export const TabGroupState = {
    NORMAL: 'normal',
    MINIMIZED: 'minimized',
    MAXIMIZED: 'maximized'
};

@HoistModel
export class TabStripModel {
    /** @member {Tab} */
    @bindable activeTab;

    /** @member {Tab[]} */
    @bindable.ref tabs = [];

    @bindable tabGroupState = TabGroupState.NORMAL;

    constructor() {
        this.registerListeners();

        if (!isRunningInOpenFin()) {
            // For testing purposes
            this.setTabs([
                new Tab({uuid: 'test', name: 'tab1'}, {title: 'Tab 1'}),
                new Tab({uuid: 'test', name: 'tab2'}, {title: 'Tab 2'}),
                new Tab({uuid: 'test', name: 'tab3'}, {title: 'Tab 3'})
            ]);

            this.setActiveTab(this.tabs[1]);
        } else {
            this.addReaction({
                track: () => this.activeTab,
                run: (tab) => {
                    tabbing.setActiveTab(tab.windowIdentity);
                }
            });
        }
    }

    destroy() {
        this.destroyListeners();
    }

    @action
    activateTab(tabId) {
        this.activeTab = this.tabs.find(it => it.id === tabId);
    }

    async minimizeAsync() {
        return tabbing.minimizeTabGroup();
    }

    async maximizeAsync() {
        return tabbing.maximizeTabGroup();
    }

    async restoreAsync() {
        return tabbing.restoreTabGroup();
    }

    async closeAsync() {
        return tabbing.closeTabGroup();
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
    onTabActivated = async (event) => {
        console.debug('TabActivatedEvent', event);
        this.setActiveTab(this.findTabByIdentity(event.identity));
    };

    /** @param {TabAddedEvent} event */
    onTabAdded = async (event) => {
        console.debug('TabAddedEvent', event);
        this.addTab(event.identity, event.properties, event.index);
    };

    /** @param {TabRemovedEvent} event */
    onTabRemoved = async (event) => {
        console.debug('TabRemovedEvent', event);
        this.removeTab(event.identity);
    };

    /** @param {TabPropertiesUpdatedEvent} event */
    onTabPropertiesUpdated = async (event) => {
        console.debug('TabPropertiesUpdatedEvent', event);
        const {identity, properties} = event,
            tab = this.findTabByIdentity(identity);

        if (tab) tab.setProperties(properties);
    };

    /** @param {TabGroupRestoredEvent} event */
    onTabGroupRestored = async (event) => {
        console.debug('TabGroupRestoredEvent', event);
        this.setTabGroupState(TabGroupState.NORMAL);
    };

    /** @param {TabGroupMinimizedEvent} event */
    onTabGroupMinimized = async (event) => {
        console.debug('TabGroupMinimizedEvent', event);
        this.setTabGroupState(TabGroupState.MINIMIZED);
    };

    /** @param {TabGroupMaximizedEvent} event */
    onTabGroupMaximized = async (event) => {
        console.debug('TabGroupMaximizedEvent', event);
        this.setTabGroupState(TabGroupState.MAXIMIZED);
    };

    registerListeners(ta) {
        this.addEventListener(tabbing, 'tab-added', this.onTabAdded);
        this.addEventListener(tabbing, 'tab-removed', this.onTabRemoved);
        this.addEventListener(tabbing, 'tab-activated', this.onTabActivated);
        this.addEventListener(tabbing, 'tab-properties-updated', this.onTabPropertiesUpdated);

        this.addEventListener(tabstrip, 'tab-group-restored', this.onTabGroupRestored);
        this.addEventListener(tabstrip, 'tab-group-minimized', this.onTabGroupMinimized);
        this.addEventListener(tabstrip, 'tab-group-maximized', this.onTabGroupMaximized);
    }

    destroyListeners() {
        this.removeEventListener(tabbing, 'tab-added', this.onTabAdded);
        this.removeEventListener(tabbing, 'tab-removed', this.onTabRemoved);
        this.removeEventListener(tabbing, 'tab-activated', this.onTabActivated);
        this.removeEventListener(tabbing, 'tab-properties-updated', this.onTabPropertiesUpdated);

        this.removeEventListener(tabstrip, 'tab-group-restored', this.onTabGroupRestored);
        this.removeEventListener(tabstrip, 'tab-group-minimized', this.onTabGroupMinimized);
        this.removeEventListener(tabstrip, 'tab-group-maximized', this.onTabGroupMaximized);
    }

    addEventListener(target, event, listener) {
        if (!isRunningInOpenFin()) return;
        target.addEventListener(event, listener);
    }

    removeEventListener(target, event, listener) {
        if (!isRunningInOpenFin()) return;
        target.removeEventListener(event, listener);
    }
}

@HoistModel
export class Tab {
    /** @member {WindowIdentity} */
    windowIdentity;

    /** @member {TabProperties} */
    @bindable.ref properties;

    get id() {
        return Tab.getTabId(this.windowIdentity);
    }

    get title() {
        return this.properties.title;
    }

    get icon() {
        return this.properties.icon;
    }

    constructor(windowIdentity, properties) {
        this.windowIdentity = windowIdentity;
        this.properties = properties;
    }

    async closeAsync() {
        return tabbing.closeTab(this.windowIdentity);
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