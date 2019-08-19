import {Component} from 'react';
import {hoistComponent, HoistComponent} from '@xh/hoist/core';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {Icon} from '@xh/hoist/icon';
import {ScreenEdge, useDockWindow} from 'openfin-react-hooks';
import {showDevTools, getWindow} from '@xh/hoist/openfin/utils';

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
        style: {},
        icon: Icon.portfolio({size: '2x'}),
        appMenuButtonOptions: {
            extraItems: [
                {
                    icon: Icon.code(),
                    text: 'Show Dev Tools',
                    onClick: () => showDevTools()
                }
            ]
        }
    });
});