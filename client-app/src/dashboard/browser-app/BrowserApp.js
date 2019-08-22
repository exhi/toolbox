import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {vframe, hframe} from '@xh/hoist/cmp/layout';
import {Icon} from '@xh/hoist/icon/Icon';
import {appBar} from '@xh/hoist/desktop/cmp/appbar';
import {tabSwitcher} from '@xh/hoist/desktop/cmp/tab';
import {tabContainer} from '@xh/hoist/cmp/tab';

@HoistComponent
export class BrowserApp extends Component {
    render() {
        const {tabModel} = this.model;
        return vframe(
            appBar({
                icon: Icon.gauge({size: '2x'}),
                title: 'Dashboard',
                leftItems: [
                    tabSwitcher({
                        model: tabModel
                    })
                ]
            }),
            hframe({
                items: [
                    tabContainer({
                        model: tabModel
                    })
                ]
            })
        );
    }
}