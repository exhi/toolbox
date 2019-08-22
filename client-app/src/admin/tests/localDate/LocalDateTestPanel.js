import React, {Component} from 'react';
import {HoistComponent} from '@xh/hoist/core';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';
import {groupBy, forOwn, startCase} from 'lodash';

import './LocalDateTestPanel.scss';
import {LocalDateTestModel} from './LocalDateTestModel';

@HoistComponent
export class LocalDateTestPanel extends Component {

    model = new LocalDateTestModel();

    render() {
        const results = groupBy(this.model.testResults, 'category'),
            items = [];

        forOwn(results, (tests, title) => {
            items.push(this.renderResultTable(title, tests));
        });

        return panel({
            className: 'local-date-test-panel xh-tiled-bg',
            items
        });
    }

    renderResultTable(title, tests) {
        return (
            <div>
                <p>{startCase(title)}</p>
                <table>
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th>Input</th>
                            <th>Expected</th>
                            <th>Output</th>
                            <th>Result</th>
                            <th>Notes</th>
                        </tr>
                        {tests.map(test => this.renderTestResult(test))}
                    </tbody>
                </table>
            </div>
        );
    }

    renderTestResult(test) {
        const {title, input, expected, output, result, notes} = test;

        return (
            <tr key={title}>
                <td>{title}</td>
                <td>{input}</td>
                <td>{expected}</td>
                <td>{output}</td>
                <td style={{textAlign: 'center'}}>
                    {result ? Icon.check({className: 'xh-green'}) : Icon.cross({className: 'xh-red'})}
                </td>
                <td>{notes}</td>
            </tr>
        );
    }

}