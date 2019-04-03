import {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {tabContainer} from '@xh/hoist/cmp/tab';

import {MaskPanel} from './MaskPanel';
import {LeftRightChooserPanel} from './LeftRightChooserPanel';
import {FileChooserPanel} from './FileChooserPanel';
import {RelativeTimestampPanel} from './RelativeTimestampPanel';
import {JsxPanel} from './JsxPanel';
import {GridTestPanel} from './GridTestPanel';

@HoistComponent
export class OtherTab extends Component {
    render() {
        return tabContainer({
            model: {
                route: 'default.other',
                switcherPosition: 'left',
                tabs: [
                    {id: 'gridTest', title: 'GridTest', content: GridTestPanel},
                    {id: 'mask', title: 'Mask', content: MaskPanel},
                    {id: 'leftRightChooser', title: 'LeftRightChooser', content: LeftRightChooserPanel},
                    {id: 'fileChooser', title: 'FileChooser', content: FileChooserPanel},
                    {id: 'timestamp', title: 'Timestamp', content: RelativeTimestampPanel},
                    {id: 'jsx', title: 'Factories vs. JSX', content: JsxPanel}
                ]
            },
            className: 'toolbox-tab'
        });
    }
}
