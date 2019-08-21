import {Component} from 'react';
import {hoistComponent, HoistComponent} from '@xh/hoist/core';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {Icon} from '@xh/hoist/icon';
import {ScreenEdge, useDockWindow} from 'openfin-react-hooks';
import {showDevTools, getWindow, showDevToolsForAllChildWindows, bringAllWindowsToFront} from '@xh/hoist/openfin/utils';
import {button} from '@xh/hoist/desktop/cmp/button';

@HoistComponent
export class App extends Component {
    render() {
        return app(this.props);
    }
}

const [, app] = hoistComponent(function App() {

    // Dock to the top of the screen, full-width
    useDockWindow(
        ScreenEdge.TOP,
        getWindow(),
        false,
        {dockedHeight: 68}  // TODO: Magic number!
    );

    return appBar({
        icon: Icon.portfolio({size: '2x'}),
        rightItems: [
            button({
                icon: Icon.window(),
                text: 'Bring All to Front',
                onClick: () => bringAllWindowsToFront()
            })
        ],
        appMenuButtonOptions: {
            extraItems: [
                {
                    icon: Icon.code(),
                    text: 'Show Dev Tools',
                    onClick: () => showDevTools()
                },
                {
                    icon: Icon.code(),
                    text: 'Show Dev Tools (all)',
                    onClick: () => showDevToolsForAllChildWindows()
                }
            ]
        }
    });
});