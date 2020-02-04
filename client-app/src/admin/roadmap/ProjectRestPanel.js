import {panel} from '@xh/hoist/desktop/cmp/panel';
import {Icon} from '@xh/hoist/icon';
import {addAction, cloneAction, deleteAction, editAction, restGrid, viewAction} from '@xh/hoist/desktop/cmp/rest';
import {dateTimeRenderer} from '@xh/hoist/format';
import {emptyFlexCol} from '@xh/hoist/cmp/grid';
import {textArea} from '@xh/hoist/desktop/cmp/input';
import {hoistCmp} from '@xh/hoist/core';

export const projectRestPanel = hoistCmp.factory({
    render() {
        return panel({
            title: 'Roadmap Project REST Editor',
            icon: Icon.edit(),
            item: restGrid({model: modelSpec})
        });
    }
});
const tooltip = s => s;

const modelSpec = {
    enableExport: true,
    store: {
        url: 'rest/projectRest',
        fields: [
            {
                name: 'category',
                lookupName: 'categories',
                lookupStrict: true,
                required: true,
                enableCreate: true
            },
            {
                name: 'name',
                required: true
            },
            {
                name: 'description',
                required: true
            },
            {
                name: 'phaseName',
                required: true,
                lookupName: 'phases',
                lookupStrict: true
            },
            {
                name: 'releaseVersion',
                lookupName: 'releaseVersions',
                lookupStrict: true,
                enableCreate: true
            },
            {
                name: 'status',
                lookupName: 'statuses',
                lookupStrict: true,
                required: true
            },
            {
                name: 'lastUpdated',
                type: 'date',
                editable: false
            },
            {
                name: 'gitLinks',
                type: 'json'
            },
            {
                name: 'lastUpdatedBy',
                editable: false
            }
        ]
    },
    unit: 'project',
    filterFields: ['name', 'status', 'category'],
    sortBy: 'name',
    columns: [
        {
            field: 'category',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Title',
            tooltip,
            width: 200
        },
        {
            field: 'description',
            tooltip,
            width: 300
        },
        {
            field: 'phaseName',
            width: 100
        },
        {
            field: 'releaseVersion',
            headerName: 'Release',
            tooltip,
            width: 100
        },
        {
            field: 'status',
            width: 100
        },
        {
            field: 'lastUpdated',
            headerName: 'Last Updated',
            renderer: dateTimeRenderer(),
            width: 200,
            tooltip,
            align: 'right'
        },
        {
            field: 'lastUpdatedBy',
            headerName: 'By:',
            width: 100
        },
        {...emptyFlexCol}
    ],
    editors: [
        {field: 'name', label: 'Title'},
        {field: 'category'},
        {field: 'phaseName'},
        {field: 'status'},
        {field: 'description',
            formField: {
                item: textArea()
            }},
        {field: 'gitLinks', label: 'Enter Github Links as Text Separated by Commas'},
        {field: 'releaseVersion'},
        {field: 'lastUpdated', label: 'Last Updated'},
        {field: 'lastUpdatedBy', label: 'Last Updated By'}
    ],
    emptyText: 'No projects found - try adding one...',
    menuActions: [
        addAction,
        editAction,
        viewAction,
        deleteAction,
        cloneAction
    ],
    prepareCloneFn: ({record, clone}) => clone.name = `${clone.name}_CLONE`
};