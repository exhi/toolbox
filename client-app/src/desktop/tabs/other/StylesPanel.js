import React from 'react';
import {hoistCmp, creates} from '@xh/hoist/core';
import {wrapper} from '../../common';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {hframe, box, span, vbox, vframe} from '@xh/hoist/cmp/layout';
import {toolbar} from '@xh/hoist/desktop/cmp/toolbar';
import {select} from '@xh/hoist/desktop/cmp/input';
import {startCase} from 'lodash';
import {button} from '@xh/hoist/desktop/cmp/button';
import {button as bpButton} from '@xh/hoist/kit/blueprint';
import {Icon} from '@xh/hoist/icon/Icon';

import {StylesPanelModel} from './StylesPanelModel';
import './StylesPanel.scss';

export const StylesPanel = hoistCmp({
    model: creates(StylesPanelModel),
    render: ({model}) => wrapper({
        description: [
            <p>
                Some components support imperative styling for theming, sizing, and changing the
                appearance of the component to indicate its purpose.
            </p>
        ],
        item: panel({
            title: 'Component Styling',
            className: 'styles-panel',
            item: hframe(
                vframe({
                    width: 600,
                    items: [
                        styledComponentContainer(
                            styledButton(),
                            bpButton({
                                text: 'Blueprint Button',
                                intent: model.theme === 'default' ? null : model.theme,
                                minimal: model.look === 'minimal',
                                small: model.size === 'compact',
                                large: model.size === 'large'
                            })
                        )
                    ]
                }),
                toolbar({
                    width: 220,
                    vertical: true,
                    items: [
                        styleControl({type: 'theme'}),
                        styleControl({type: 'size'}),
                        styleControl({type: 'look'})
                    ]
                })
            )
        })
    })
});

const styledComponentContainer = hoistCmp.factory(
    ({description, children}) => vbox({
        className: 'container',
        items: [
            description,
            children
        ]
    })
);

const styledButton = hoistCmp.factory({
    render: ({model}) => button({
        theme: model.theme,
        size: model.size,
        look: model.look,

        text: 'Styled Button',
        icon: Icon.rocket()
    })
});

const styleControl = hoistCmp.factory({
    render: ({type, model}) => vbox(
        box({
            className: 'control-label',
            item: span(startCase(type))
        }),
        select({
            bind: type,
            options: model[`${type}Options`]
        })
    )
});