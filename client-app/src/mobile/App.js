import {hoistCmp} from '@xh/hoist/core';
import {panel} from '@xh/hoist/mobile/cmp/panel';
import {appBar} from '@xh/hoist/mobile/cmp/header';
import {navigator} from '@xh/hoist/mobile/cmp/navigator';
import {Icon} from '@xh/hoist/icon';
import './App.scss';

export const App = hoistCmp({
    displayName: 'App',

    render() {
        return panel({
            tbar: appBar({
                icon: Icon.boxFull({size: 'lg', prefix: 'fal'}),
                hideRefreshButton: false,
                appMenuButtonProps: {hideLogoutItem: false}
            }),
            item: navigator()
        });
    }
});