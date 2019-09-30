import {HoistModel} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';

@HoistModel
export class StylesPanelModel {
    @bindable theme = 'default';
    @bindable size = 'default';
    @bindable look = 'default';

    themeOptions = [
        {
            value: null,
            label: 'None'
        },
        {
            value: 'default',
            label: 'Default'
        },
        {
            value: 'primary',
            label: 'Primary'
        },
        {
            value: 'info',
            label: 'Info'
        },
        {
            value: 'success',
            label: 'Success'
        },
        {
            value: 'warning',
            label: 'Warning'
        },
        {
            value: 'danger',
            label: 'Danger'
        }
    ];

    sizeOptions = [
        {
            value: 'default',
            label: 'Default'
        },
        {
            value: 'compact',
            label: 'Compact'
        },
        {
            value: 'large',
            label: 'Large'
        }
    ];

    lookOptions = [
        {
            value: 'default',
            label: 'Default'
        },
        {
            value: 'minimal',
            label: 'Minimal'
        },
        {
            value: 'round',
            label: 'Round'
        }
    ];
}