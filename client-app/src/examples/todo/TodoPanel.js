import {grid, gridCountLabel} from '@xh/hoist/cmp/grid';
import {fragment, filler} from '@xh/hoist/cmp/layout';
import {creates, hoistCmp} from '@xh/hoist/core';
import {button} from '@xh/hoist/desktop/cmp/button';
import {buttonGroupInput} from '@xh/hoist/desktop/cmp/input';
import {panel} from '@xh/hoist/desktop/cmp/panel';
import {toolbar, toolbarSep} from '@xh/hoist/desktop/cmp/toolbar';
import {Icon} from '@xh/hoist/icon/Icon';
import {taskDialog} from './TaskDialog';
import {TodoPanelModel} from './TodoPanelModel';
import {every} from 'lodash';

export const todoPanel = hoistCmp.factory({
    model: creates(TodoPanelModel),

    render() {
        return fragment(
            taskDialog(),
            panel({
                tbar: tbar(),
                item: grid()
            })
        );
    }
});

const tbar = hoistCmp.factory(
    ({model}) => {
        const {taskDialogModel, selectedTasks} = model,
            task = selectedTasks[0]?.data,
            count = selectedTasks.length,
            mixedStatus = () => !(every(selectedTasks, ['data.complete', true]) || every(selectedTasks, ['data.complete', false]));

        return toolbar({
            enableOverflowMenu: true,
            items: [
                button({
                    icon: Icon.add(),
                    text: 'New',
                    intent: 'success',
                    onClick: () => taskDialogModel.openAddForm()
                }),
                toolbarSep(),
                button({
                    icon: Icon.edit(),
                    text: 'Edit',
                    intent: 'primary',
                    disabled: count !== 1,
                    onClick: () => taskDialogModel.openEditForm(task)
                }),
                button({
                    icon: Icon.delete(),
                    text: 'Remove',
                    intent: 'danger',
                    disabled: !count,
                    onClick: () => model.removeTasksAsync()
                }),
                filler(),
                button({
                    icon: count && task.complete ? Icon.reset() : Icon.check(),
                    text: count && task.complete ? 'Mark In Progress' : 'Mark Complete',
                    disabled: !count || mixedStatus(),
                    onClick: () => model.toggleCompleteAsync(!task.complete)
                }),
                toolbarSep(),
                gridCountLabel({unit: 'task'}),
                toolbarSep(),
                buttonGroupInput({
                    bind: 'filterBy',
                    outlined: true,
                    items: [
                        button({text: 'All', value: 'all'}),
                        button({text: 'In Progress', value: 'active'}),
                        button({text: 'Complete', value: 'complete'})
                    ]
                })
            ]
        });
    }
);
