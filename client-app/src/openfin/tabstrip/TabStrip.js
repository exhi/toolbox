import React from 'react';
import {hbox, filler} from '@xh/hoist/cmp/layout';
import {tabs as bpTabs, tab as bpTab} from '@xh/hoist/kit/blueprint';
import {button, buttonGroup} from '@xh/hoist/desktop/cmp/button';
import {Icon} from '@xh/hoist/icon';
import {hoistCmp, creates} from '@xh/hoist/core';

import {TabStripModel, TabGroupState} from './TabStripModel';
import './TabStrip.scss';

export const tabStrip = hoistCmp.factory({
    model: creates(TabStripModel),
    className: 'tabstrip',
    render: ({model}) => {
        const {tabs, activeTab, tabGroupState} = model;
        return hbox({
            id: 'tabs-container',
            maxHeight: 42,
            minHeight: 42,
            items: [
                bpTabs({
                    id: 'tabs',
                    selectedTabId: activeTab ? activeTab.id : null,
                    onChange: (tabId) => model.activateTab(tabId),
                    items: tabs.map(tab => bpTab({
                        id: tab.id,
                        item: hbox({
                            className: 'tab',
                            draggable: true,
                            onDragStart: (e) => model.onTabDragStart(tab, e),
                            onDragEnd: (e) => model.onTabDragEnd(tab, e),
                            items: [
                                tab.icon && tab.icon.startsWith('<svg') ?
                                    <div dangerouslySetInnerHTML={{__html: tab.icon}}/> :
                                    null,
                                <div>{tab.title}</div>,
                                button({
                                    icon: Icon.close(),
                                    onClick: () => tab.closeAsync()
                                })
                            ]
                        })
                    }))
                }),
                filler(),
                buttonGroup({
                    className: 'tab-group-actions',
                    items: [
                        button({
                            icon: Icon.minimize(),
                            onClick: () => model.minimizeAsync()
                        }),
                        button({
                            omit: tabGroupState === TabGroupState.MAXIMIZED,
                            icon: Icon.expand(),
                            onClick: () => model.maximizeAsync()
                        }),
                        button({
                            omit: tabGroupState !== TabGroupState.MAXIMIZED,
                            icon: Icon.collapse(),
                            onClick: () => model.restoreAsync()
                        }),
                        button({
                            icon: Icon.close(),
                            intent: 'danger',
                            onClick: () => model.closeAsync()
                        })
                    ]
                })
            ]
        });
    }
});

