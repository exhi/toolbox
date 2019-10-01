import {hoistCmp} from '@xh/hoist/core';
import {page} from '@xh/hoist/mobile/cmp/page';
import {div, vbox, box} from '@xh/hoist/cmp/layout';

export const VBoxPage = hoistCmp({

    render() {
        const defaults = {padding: 10, className: 'toolbox-containers-box'};

        return page({
            className: 'toolbox-containers-page',
            items: [
                div({
                    className: 'toolbox-description',
                    item: `
                        A vbox lays out its children vertically, rendering a box with flexDirection 
                        set to column.
                    `
                }),
                vbox(
                    box({...defaults, flex: 1, item: 'flex: 1'}),
                    box({...defaults, height: 80, item: 'height: 80'}),
                    box({...defaults, flex: 2, item: 'flex: 2'})
                )
            ]
        });
    }
});