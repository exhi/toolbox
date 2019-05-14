import {tabContainer} from '@xh/hoist/cmp/tab';
import {HoistComponent} from '@xh/hoist/core';
import {Component} from 'react';
import {FileChooserPanel} from './FileChooserPanel';
import {IconsPanel} from './IconsPanel';
import {JsxPanel} from './JsxPanel';
import {LeftRightChooserPanel} from './LeftRightChooserPanel';
import {MaskPanel} from './MaskPanel';
import {RelativeTimestampPanel} from './RelativeTimestampPanel';
import {PopupsPanel} from './PopupsPanel';

@HoistComponent
export class OtherTab extends Component {
    render() {
        return tabContainer({
            model: {
                route: 'default.other',
                switcherPosition: 'left',
                tabs: [
                    {id: 'icons', title: 'Icons', content: IconsPanel},
                    {id: 'mask', title: 'Mask', content: MaskPanel},
                    {id: 'leftRightChooser', title: 'LeftRightChooser', content: LeftRightChooserPanel},
                    {id: 'fileChooser', title: 'FileChooser', content: FileChooserPanel},
                    {id: 'timestamp', title: 'Timestamp', content: RelativeTimestampPanel},
                    {id: 'jsx', title: 'Factories vs. JSX', content: JsxPanel},
                    {id: 'popups', content: PopupsPanel}
                ]
            },
            className: 'toolbox-tab'
        });
    }
}
