import {library} from '@fortawesome/fontawesome-svg-core';
import {faTag} from '@fortawesome/pro-regular-svg-icons';
import {grid} from '@xh/hoist/cmp/grid';
import {filler, hframe} from '@xh/hoist/cmp/layout';
import {storeCountLabel, storeFilterField} from '@xh/hoist/cmp/store';
import {creates, hoistCmp} from '@xh/hoist/core';
import {button, colChooserButton, exportButton} from '@xh/hoist/desktop/cmp/button';
import {buttonGroupInput, select} from '@xh/hoist/desktop/cmp/input';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {Icon} from '@xh/hoist/icon';
import {tileView} from './cmp/TileView';
import {detailsPanel} from './details/DetailsPanel';
import './DirectoryPanel.scss';
import {DirectoryPanelModel} from './DirectoryPanelModel';

library.add(faTag);

export const directoryPanel = hoistCmp.factory({
    model: creates(DirectoryPanelModel),

    render({model}) {
        return panel({
            className: 'tb-directory-panel',
            mask: 'onLoad',
            item: hframe(
                panel({
                    tbar: tbar(),
                    item: model.displayMode === 'grid' ? grid() : tileView(),
                    bbar: bbar()
                }),
                detailsPanel({
                    className: 'xh-border-left'
                })
            )
        });
    }
});

const tbar = hoistCmp.factory(
    ({model}) => {
        const {locationList, tagList} = model;

        return toolbar({
            className: 'tb-directory-panel__tbar',
            items: [
                storeFilterField({
                    leftIcon: Icon.search(),
                    autoApply: false,
                    onFilterChange: (fn) => model.setQuickFilter(fn),
                    width: 200
                }),
                select({
                    bind: 'locationFilter',
                    placeholder: 'Location',
                    leftIcon: Icon.location(),
                    enableClear: true,
                    options: locationList,
                    width: 200
                }),
                select({
                    bind: 'tagFilters',
                    placeholder: 'Tags',
                    // TODO - use when in Hoist.
                    // leftIcon: Icon.tag(),
                    leftIcon: Icon.icon({iconName: 'tag'}),
                    enableMulti: true,
                    enableClear: true,
                    options: tagList,
                    flex: 4,
                    maxWidth: 400
                }),
                filler(),
                buttonGroupInput({
                    bind: 'displayMode',
                    outlined: true,
                    intent: 'primary',
                    items: [
                        button({
                            text: 'Details',
                            value: 'grid',
                            width: 80
                        }),
                        button({
                            text: 'Faces',
                            value: 'tiles',
                            width: 80
                        })
                    ]
                })
            ]
        });
    }
);

const bbar = hoistCmp.factory(
    ({model}) => {
        const {displayMode, gridModel} = model,
            {store} = gridModel;

        return toolbar(
            filler(),
            storeCountLabel({store, unit: 'XH Engineers'}),
            toolbarSep(),
            colChooserButton({
                disabled: displayMode !== 'grid'
            }),
            exportButton()
        );
    });
