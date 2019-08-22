import {Component} from 'react';
import {HoistComponent, hoistElemFactory} from '@xh/hoist/core';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {Icon} from '@xh/hoist/icon';
import {ScreenEdge, useDockWindow} from 'openfin-react-hooks';
import {
    showDevTools,
    getWindow,
    showDevToolsForAllChildWindows,
    bringAllWindowsToFront,
    quitApplication
} from '@xh/hoist/openfin/utils';
import {button} from '@xh/hoist/desktop/cmp/button';
import {OpenFinAppModel} from './OpenFinAppModel';
import {useProvidedModel} from '@xh/hoist/core/hooks';

@HoistComponent
export class OpenFinApp extends Component {
    render() {
        return openFinApp({model: this.model});
    }
}

export const openFinApp = hoistElemFactory(props => {
    // Dock to the top of the screen, full-width
    useDockWindow(
        ScreenEdge.TOP,
        getWindow(),
        false,
        {dockedHeight: 68}  // TODO: Magic number!
    );

    useProvidedModel(OpenFinAppModel, props);

    return appBar({
        icon: Icon.portfolio({size: '2x'}),
        rightItems: [
            button({
                icon: Icon.window(),
                text: 'Bring All to Front',
                onClick: () => bringAllWindowsToFront()
            }),
            button({
                icon: Icon.code(),
                text: 'Show Dev Tools',
                onClick: () => showDevTools()
            }),
            button({
                icon: Icon.code(),
                text: 'Show Dev Tools (all)',
                onClick: () => showDevToolsForAllChildWindows()
            }),
            button({
                icon: Icon.close(),
                intent: 'danger',
                text: 'Quit',
                onClick: () => quitApplication()
            })
        ]
    });
});