import React from 'react';
import {hoistCmp, XH} from '@xh/hoist/core';
import {Icon} from '@xh/hoist/icon';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {wrapper} from '../../common/Wrapper';
import logo from '../../../core/img/xhio+hoist.png';
import logoDark from '../../../core/img/xhio+hoist-dark.png';
import './HomeTab.scss';

export const homeTab = hoistCmp.factory(
    () => {
        const link = (txt, url) => <a href={url} target="_blank">{txt}</a>;

        return wrapper(
            panel({
                width: 700,
                height: 400,
                title: 'Welcome to Toolbox',
                icon: Icon.home(),
                item: [
                    <div className="toolbox-welcome">
                        <p>
                            Toolbox provides an inventory and examples of key components,
                            code, and UI patterns available in {link('Hoist React', 'https://github.com/xh/hoist-react/')},
                            a library created by {link('Extremely Heavy Industries', 'https://xh.io')} for
                            building and operating enterprise web applications.
                        </p>
                        <p>
                            Navigate using the tabs above to explore the available components. The Toolbox
                            app itself is written using Hoist React, and its {link('source code', 'https://github.com/xh/toolbox')} is
                            available on Github for review.
                        </p>
                        <div className="toolbox-welcome__logo">
                            <img src={XH.darkTheme ? logoDark : logo} alt="xh.io + Hoist"/>
                            <p>
                                Please {link('contact us', 'https://xh.io/contact/')} with
                                questions or for more information.
                            </p>
                        </div>
                    </div>
                ]
            })
        );
    }
);