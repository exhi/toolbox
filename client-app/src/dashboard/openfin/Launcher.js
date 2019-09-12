import {hoistElemFactory} from '@xh/hoist/core';
import {appBar, appBarSeparator} from '@xh/hoist/desktop/cmp/appbar';
import {Icon} from '@xh/hoist/icon';
import {ScreenEdge, useDockWindow} from 'openfin-react-hooks';
import {
    getWindow,
    bringAllWindowsToFront,
    quitApplication,
    isRunningInOpenFin
} from '@xh/hoist/openfin/utils';
import {button} from '@xh/hoist/desktop/cmp/button';
import {LauncherModel} from './LauncherModel';
import {useLocalModel} from '@xh/hoist/core/hooks';

export const launcher = hoistElemFactory(
    () => {
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

        const model = useLocalModel(LauncherModel);

        return appBar({
            title: 'Hoist + OpenFin',
            icon: Icon.portfolio({size: '2x'}),
            hideAppMenuButton: true,
            leftItems: [
                button({
                    icon: Icon.portfolio(),
                    text: 'Positions',
                    onClick: () => model.createWindow('positions', 'Positions', Icon.portfolio())
                }),
                button({
                    icon: Icon.bolt(),
                    text: 'Trades',
                    onClick: () => model.createWindow('trades', 'Trades', Icon.bolt())
                })
            ],
            rightItems: [
                button({
                    icon: Icon.save(),
                    intent: 'success',
                    text: 'Save Layout',
                    onClick: () => model.saveLayoutAsync()
                }),
                button({
                    icon: Icon.reset(),
                    intent: 'primary',
                    text: 'Restore Layout',
                    onClick: () => model.restoreLayoutAsync()
                }),
                appBarSeparator(),
                button({
                    icon: Icon.window(),
                    text: 'Bring All to Front',
                    onClick: () => bringAllWindowsToFront()
                }),
                appBarSeparator(),
                /*
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
                 */
                button({
                    icon: Icon.close(),
                    intent: 'danger',
                    text: 'Quit',
                    onClick: () => quitApplication()
                })
            ]
        });
    });