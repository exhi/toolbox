import React from 'react';
import {hoistCmp, XH, local, HoistModel, managed} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {box, hbox, filler, p, h3} from '@xh/hoist/cmp/layout';
import {panel, PanelModel} from '@xh/hoist/desktop/cmp/panel';
import {button} from '@xh/hoist/desktop/cmp/button';
import {relativeTimestamp} from '@xh/hoist/cmp/relativetimestamp';
import {wrapper} from '../../common/Wrapper';

export const PanelSizingPanel = hoistCmp({
    model: local(() => new Model()),

    render({model}) {
        return wrapper({
            description: (
                <div>
                    <p>
                        Panels support collapsing and drag-and-drop resizing via their <code>model</code> config,
                        optionally saving their sizing state in a per-user preference.
                    </p>
                    <p>
                        Note that the child panels below are also configured with
                        their <code>compactHeader</code> prop set to true.
                    </p>
                </div>
            ),
            links: [
                {url: '$TB/client-app/src/desktop/tabs/panels/PanelSizingPanel.js', notes: 'This example.'},
                {url: '$HR/desktop/cmp/panel/Panel.js', notes: 'Hoist component.'},
                {url: '$HR/desktop/cmp/panel/PanelModel.js', notes: 'Hoist component model (for resize / collapse).'}
            ],
            item: panel({
                title: 'Panels › Panel Sizing',
                icon: Icon.window(),
                height: 450,
                width: 700,
                items: [
                    hbox({
                        flex: 1,
                        className: 'xh-border-top',
                        items: [
                            panel({
                                title: 'Left Panel',
                                icon: Icon.arrowToLeft(),
                                model: model.leftPanelModel,
                                compactHeader: true,
                                item: box({
                                    className: 'xh-pad',
                                    item: 'Collapsible Left'
                                })
                            }),
                            panel({
                                item: box({
                                    items: loremIpsum,
                                    padding: '0 6 6 6',
                                    display: 'block',
                                    overflowY: 'auto'
                                }),
                                tbar: [
                                    filler(),
                                    button({
                                        text: 'Expand All',
                                        disabled: model.allExpanded,
                                        onClick: () => model.setCollapsedAll(false)
                                    }),
                                    button({
                                        text: 'Collapse All',
                                        disabled: model.allCollapsed,
                                        onClick: () => model.setCollapsedAll(true)
                                    })
                                ]
                            }),
                            panel({
                                title: 'Right Panel',
                                icon: Icon.arrowToRight(),
                                model: model.rightPanelModel,
                                compactHeader: true,
                                item: box({
                                    className: 'xh-pad',
                                    item: 'Collapsible Right'
                                })
                            })
                        ]
                    }),
                    panel({
                        title: 'Bottom Panel',
                        icon: Icon.arrowToBottom(),
                        model: model.bottomPanelModel,
                        compactHeader: true,
                        item: box({
                            padding: 10,
                            item: 'Collapsible Bottom'
                        }),
                        headerItems: [
                            relativeTimestamp({
                                options: {prefix: 'Rendered'},
                                timestamp: Date.now(),
                                marginLeft: 4
                            }),
                            button({
                                icon: Icon.gear(),
                                minimal: true,
                                onClick: () => XH.toast({message: 'You clicked a Panel headerItem'})
                            })
                        ]
                    })
                ]
            })
        });
    }
});

const loremIpsum = [
    h3({
        className: 'xh-text-color-accent',
        item: 'Some old-fashioned text content'
    }),
    p('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta velit varius augue fermentum, vulputate tempus magna tempus.)'),
    p('Fusce consectetur malesuada vehicula. Aliquam commodo magna at porta sollicitudin. Sed laoreet vehicula leo vel aliquam. Aliquam auctor fringilla ex, nec iaculis felis tincidunt ac. Pellentesque blandit ipsum odio, vel lacinia arcu blandit non.'),
    p('Vestibulum non libero sem. Mauris a ipsum elit. Donec vestibulum sodales dapibus. Mauris posuere facilisis mollis. Etiam nec mauris nunc. Praesent mauris libero, blandit gravida ullamcorper vel, condimentum et velit. Suspendisse fermentum odio ac dui aliquet semper. Duis arcu felis, accumsan in leo sit amet, vehicula imperdiet tellus. Nulla ut condimentum quam. Donec eget mauris vitae libero blandit facilisis efficitur id justo.'),
    p('Nam et tincidunt risus, at faucibus enim. Aliquam tortor est, finibus ac metus id, eleifend auctor quam. Aenean purus odio, tempus interdum velit et, faucibus placerat nisi. Etiam eget nunc vehicula, eleifend justo quis, varius leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris bibendum mollis tempor.'),
    p('Fusce ac sollicitudin nunc, at tempus sem. Fusce dapibus lorem malesuada vestibulum luctus. Etiam semper est in ligula sagittis facilisis. Phasellus accumsan placerat ex, eu fringilla mauris semper nec.')
];


@HoistModel
class Model {
    @managed
    leftPanelModel = new PanelModel({
        defaultSize: 150,
        side: 'left'
    });

    @managed
    rightPanelModel = new PanelModel({
        defaultSize: 150,
        side: 'right'
    });

    @managed
    bottomPanelModel = new PanelModel({
        defaultSize: 130,
        side: 'bottom'
    });

    get allExpanded() {
        return !this.leftPanelModel.collapsed && !this.rightPanelModel.collapsed && !this.bottomPanelModel.collapsed;
    }

    get allCollapsed() {
        return this.leftPanelModel.collapsed && this.rightPanelModel.collapsed && this.bottomPanelModel.collapsed;
    }

    setCollapsedAll(collapsed) {
        this.leftPanelModel.setCollapsed(collapsed);
        this.rightPanelModel.setCollapsed(collapsed);
        this.bottomPanelModel.setCollapsed(collapsed);
    }
}