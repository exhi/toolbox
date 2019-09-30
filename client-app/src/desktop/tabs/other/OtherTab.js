import {tabContainer} from '@xh/hoist/cmp/tab';
import {hoistCmp} from '@xh/hoist/core';
import {FileChooserPanel} from './FileChooserPanel';
import {IconsPanel} from './IconsPanel';
import {JsxPanel} from './JsxPanel';
import {LeftRightChooserPanel} from './LeftRightChooserPanel';
import {RelativeTimestampPanel} from './RelativeTimestampPanel';
import {PopupsPanel} from './PopupsPanel';
import {StylesPanel} from './StylesPanel';

export const OtherTab = hoistCmp(
    () => tabContainer({
        model: {
            route: 'default.other',
            switcherPosition: 'left',
            tabs: [
                {id: 'popups', content: PopupsPanel},
                {id: 'icons', title: 'Icons', content: IconsPanel},
                {id: 'leftRightChooser', title: 'LeftRightChooser', content: LeftRightChooserPanel},
                {id: 'fileChooser', title: 'FileChooser', content: FileChooserPanel},
                {id: 'timestamp', title: 'Timestamp', content: RelativeTimestampPanel},
                {id: 'jsx', title: 'Factories vs. JSX', content: JsxPanel},
                {id: 'styles', title: 'Styles', content: StylesPanel}
            ]
        },
        className: 'toolbox-tab'
    })
);
