import {hoistElemFactory} from '@xh/hoist/core';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {Icon} from '@xh/hoist/icon';
import {ScreenEdge, useDockWindow} from 'openfin-react-hooks';
import {
    showDevTools,
    getWindow,
    showDevToolsForAllChildWindows,
    bringAllWindowsToFront,
    quitApplication, isRunningInOpenFin
} from '@xh/hoist/openfin/utils';
import {button} from '@xh/hoist/desktop/cmp/button';
import {LauncherModel} from './LauncherModel';
import {useLocalModel} from '@xh/hoist/core/hooks';

export const launcher = hoistElemFactory(() => {
    if (!isRunningInOpenFin()) {
        return 'Not running in OpenFin!';
    }

    // Dock to the top of the screen, full-width
    useDockWindow(
        ScreenEdge.TOP,
        getWindow(),
        false,
        {dockedHeight: 68}  // TODO: Magic number!
    );

    useLocalModel(LauncherModel);
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