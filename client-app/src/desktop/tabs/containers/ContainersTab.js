import {hoistCmp} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {HBoxContainerPanel} from './HBoxContainerPanel';
import {VBoxContainerPanel} from './VBoxContainerPanel';
import {TabPanelContainerPanel} from './TabPanelContainerPanel';
import {DockContainerPanel} from './DockContainerPanel';
import {DashContainerPanel} from './DashContainerPanel';

import './ContainersTab.scss';

export const ContainersTab = hoistCmp(
    () => tabContainer({
        model: {
            route: 'default.containers',
            switcherPosition: 'left',
            tabs: [
                {id: 'hbox', title: 'HBox', content: HBoxContainerPanel},
                {id: 'vbox', title: 'VBox', content: VBoxContainerPanel},
                {id: 'tabPanel', title: 'TabContainer', content: TabPanelContainerPanel},
                {id: 'dock', title: 'DockContainer', content: DockContainerPanel},
                {id: 'dash', title: 'DashContainer', content: DashContainerPanel}
            ]
        },
        className: 'toolbox-tab'
    })
);
