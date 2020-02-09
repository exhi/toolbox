import {dataView} from '@xh/hoist/cmp/dataview';
import {filler, hbox} from '@xh/hoist/cmp/layout';
import {storeFilterField} from '@xh/hoist/cmp/store';
import {creates, hoistCmp} from '@xh/hoist/core';
import {button} from '@xh/hoist/desktop/cmp/button';
import {buttonGroupInput} from '@xh/hoist/desktop/cmp/input';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {Icon} from '@xh/hoist/icon';
import {RoadmapModel} from './RoadmapModel';
import './RoadmapView.scss';

export const roadmapView = hoistCmp.factory({
    model: creates(RoadmapModel),

    render({model, ...props})  {
        return panel({
            title: 'Hoist Roadmap',
            icon: Icon.mapSigns(),
            className: 'tb-roadmap',
            item: dataView(),
            bbar: bbar(),
            ...props
        });
    }
});

const bbar = hoistCmp.factory(
    ({model}) => toolbar(
        buttonGroupInput({
            bind: 'statusFilter',
            items: [
                button({
                    text: 'Planned',
                    icon: Icon.mapSigns(),
                    value: 'showPipeline',
                    width: 100
                }),
                button({
                    text: 'Released',
                    icon: Icon.checkCircle(),
                    value: 'showReleased',
                    width: 100
                })
            ]
        }),
        filler(),
        storeFilterField({store: model.dataViewModel.store})
    )
);

// Custom group renderer
export const roadmapGroupRow = hoistCmp.factory(
    ({node}) => {
        const projectRec = node.allLeafChildren[0].data;
        return hbox(
            {
                className: 'roadmap-group-row',
                onClick: () => node.setExpanded(!node.expanded),
                items: [
                    Icon.calendar({className: 'xh-white', prefix: 'fal'}),
                    projectRec.data.phaseName
                ]
            }
        );
    }
);
