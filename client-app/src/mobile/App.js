import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {panel} from '@xh/hoist/mobile/cmp/panel';
import {appBar} from '@xh/hoist/mobile/cmp/header';
import {navigator} from '@xh/hoist/mobile/cmp/navigator';
import {Icon} from '@xh/hoist/icon';

import './App.scss';

@HoistComponent
export class App extends Component {

    render() {
        const {appMenuModel, navigatorModel} = this.model;

        return panel({
            tbar: appBar({
                icon: Icon.boxFull({size: 'lg', prefix: 'fal'}),
                appMenuModel,
                navigatorModel,
                hideRefreshButton: false
            }),
            item: navigator({model: navigatorModel})
        });
    }
}