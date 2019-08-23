import {hoistComponent, useProvidedModel} from '@xh/hoist/core';
import {AppModel} from './AppModel';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {vframe} from '@xh/hoist/cmp/layout';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {Icon} from '@xh/hoist/icon';
import {tabSwitcher} from '@xh/hoist/desktop/cmp/tab';
import {webSocketIndicator} from '@xh/hoist/cmp/websocket';
import {tabContainer} from '@xh/hoist/cmp/tab';

export const App = hoistComponent(props => {
    const model = useProvidedModel(AppModel, props),
        {tabModel} = model;

    return vframe(
        appBar({
            omit: isRunningInOpenFin(),
            icon: Icon.gauge({size: '2x'}),
            title: 'Dashboard',
            leftItems: [tabSwitcher({model: tabModel})],
            rightItems: [webSocketIndicator()]
        }),
        tabContainer({model: tabModel})
    );
});