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
import {jsonInput} from '@xh/hoist/desktop/cmp/form';
import {Icon} from '@xh/hoist/icon';
import {wrapper} from '../../common';

import './JsxPanel.scss';

@HoistComponent
export class JsxPanel extends Component {

    render() {
        return wrapper({
            description: [
                <p>
                    JSX is the XML-like extension to Javascript typically used to specify
                    and configure React components. While most React guides and examples on the web
                    will use JSX, Hoist React provides an alternative native Javascript syntax based
                    on a factory pattern.
                </p>,
                <p>
                    Hoist encourages the use of its <code>elemFactory()</code> method to create and export
                    factory methods for custom components. These methods take a configuration
                    object where properties and child elements are specified without any wrapping
                    braces or additional syntax required.
                </p>,
                <p>
                    We believe that the factory approach excels for declarative specification
                    of code-heavy element trees.  For element trees with a significant amount of
                    hypertext, JSX might be a better choice. Both can be used interchangably, even within
                    the same render method.
                </p>
            ],
            item: hframe({
                width: '90%',
                items: [
                    panel({
                        flex: 1,
                        className: 'toolbox-jsx-example',
                        icon: Icon.factory({prefix: 'fas', size: 'lg'}),
                        title: 'Using Factories',
                        item: this.renderCode(this.getElemExample(), 'text/javascript')
                    }),
                    panel({
                        flex: 1,
                        className: 'toolbox-jsx-example',
                        icon: Icon.code({size: 'lg'}),
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
        return jsonInput({
            editorProps: {mode, readOnly: true},
            value: value.trim()
        });
    }

    getElemExample() {
        return `
render() {
    return hframe({
        ...this.props,
        className: 'xh-log-viewer',
        items: [
            panel({
                    item: grid({model: files}),
                    bbar: toolbar(
                        ...buttonCfgs.map(props => button(props)),
                        deleteButton({
                            omit: !XH.getUser().isHoistAdmin,
                            onClick: () => {
                                this.doDelete();
                            }
                        }),
                        filler(),
                        storeFilterField({gridModel: files})
                     )
                })
            logViewer({model}),
            mask({model: loadModel})
        ]
    });
}
        `;
    }

    getJsxExample() {
        return `
render() {
    return (
        <HFrame
            {...this.props}
            className="xh-log-viewer"
        >
            <Panel
                bbar={
                    <Toolbar>
                        {
                            buttonCfgs.map(props => {
                                return <Button {...props} />;
                            })
                        }
                        {
                            XH.getUser().isHoistAdmin && 
                                <DeleteButton
                                    onClick={
                                        () => {
                                            this.doDelete();
                                        }
                                    }
                                />
                        }
                        <Filler />
                        <StoreFilterField gridModel={files}/>
                    </Toolbar>
                }
            >
                <Grid model={files} />
            </Panel>
            <LogViewer model={model} />
            <Mask model={loadModel} />
        </HFrame>
    );
}
        `;
    }

}