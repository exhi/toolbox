/*
 * This file belongs to Hoist, an application development toolkit
 * developed by Extremely Heavy Industries (www.xh.io | info@xh.io)
 *
 * Copyright © 2018 Extremely Heavy Industries Inc.
 */
import React, {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {hframe} from '@xh/hoist/cmp/layout';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {jsonField} from '@xh/hoist/desktop/cmp/form';
import {wrapper} from '../../common';

import './JsxTab.scss';

@HoistComponent()
export class JsxTab extends Component {

    render() {
        return wrapper({
            description: [
                <p>
                    JSX is the XML-like extension to Javascript typically used to specify
                    and configure React components. While most React guides and examples on the web
                    will use JSX, Hoist React provides an alternative syntax that looks and works
                    more like "native" Javascript, while preserving several key advantages of
                    JSX when it comes to clearly defining a component hierarchy.
                </p>,
                <p>
                    Hoist encourages the use of its elemFactory() method to create and export
                    factory methods for custom components. These methods take a configuration
                    object where properties and child elements are specified without any wrapping
                    braces or additional syntax required, but with several customized conveniences.
                </p>
            ],
            item: hframe({
                width: '90%',
                items: [
                    panel({
                        flex: 1,
                        className: 'toolbox-jsx-example',
                        title: 'Using ElemFactory',
                        item: this.renderCode(this.getElemExample(), 'text/javascript')
                    }),
                    panel({
                        flex: 1,
                        className: 'toolbox-jsx-example',
                        title: 'Using JSX',
                        item: this.renderCode(this.getJsxExample(), 'text/typescript-jsx')
                    })
                ]
            })
        });
    }

    //------------------------
    // Implementation
    //------------------------
    renderCode(value, mode) {
        return jsonField({
            editorProps: {mode, readOnly: true},
            value: value.trim()
        });
    }

    getElemExample() {
        return `
hframe({
    className: 'xh-log-viewer',
    items: [
        resizable({
            side: 'right',
            contentSize: 250,
            isOpen: true,
            item: panel({
                item: grid({model: files}),
                bbar: toolbar(
                    deleteButton({
                        omit: !XH.getUser().isHoistAdmin
                    }),
                    filler(),
                    storeFilterField({store: files.store, fields: ['filename']})
                 )
            })
        }),
        logViewer({model}),
        loadMask({model: loadModel})
    ]
});
        `;
    }

    getJsxExample() {
        return `
<HFrame className="xh-log-viewer">
    <Resizable
        side="right"
        contentSize={250}
        isOpen
    >
        <Panel
            bbar={
                <Toolbar>
                    <DeleteButton
                        omit={!XH.getUser().isHoistAdmin}
                    />
                    <Filler />
                    <StoreFilterField
                        store={files.store}
                        fields={['filename']}
                    />
                </Toolbar>
            }
        >
            <Grid model={files} />
        </Panel>
    </Resizable>
</HFrame>
        `;
    }

}