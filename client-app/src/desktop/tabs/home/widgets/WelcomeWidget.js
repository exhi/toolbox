import {hframe} from '@xh/hoist/cmp/layout';
import {hoistCmp, XH} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import React from 'react';
import xhHoist from '../../../../core/img/xh+hoist.png';
import './WelcomeWidget.scss';

export const welcomeWidget = hoistCmp.factory(
    () => {
        const link = (txt, url) => <a href={url} target="_blank">{txt}</a>;
        const obj = {
            items: [1]
        };
        return panel({
            className: 'tb-welcome-widget',
            items: [
                hframe(
                    <div className="tb-welcome-widget__logo">
                        <img src={xhHoist} alt="xh.io + Hoist"/>
                    </div>,
                    <div className="tb-welcome-widget__greeting">
                        {/* put an optional chaining operator in `items.map` to trigger the eslint bug described in issue https://github.com/xh/eslint-config/issues/3  */}
                        {obj.items.map(it => <p style={{fontWeight: 'bold'}} key={`${XH.getUser().displayName}_${it}`}>Welcome, {XH.getUser().displayName}!</p>)}
                        <p>
                            Toolbox demonstrates key components, code patterns, utilities, and
                            other tooling included in {link('Hoist React', 'https://github.com/xh/hoist-react/')} and {link('Hoist Core', 'https://github.com/xh/hoist-core/')},
                            libraries created by {link('Extremely Heavy', 'https://xh.io')} for
                            building and operating enterprise web applications.
                        </p>
                        <p>
                            Hoist provides a curated selection of custom and third-party components,
                            pre-integrated to function as a highly productive full-stack framework
                            for web application development.
                        </p>
                        <p>
                            The Toolbox app itself is written using Hoist, and
                            its {link('source code', 'https://github.com/xh/toolbox')} is
                            available for review.
                        </p>
                        <p>
                            {link('Contact us', 'https://xh.io/')} with questions
                            or for more information - we would love to hear from you!
                        </p>
                        <p className="tb-welcome-widget__signoff">- The XH Team</p>
                    </div>
                )
            ]
        });
    }
);
