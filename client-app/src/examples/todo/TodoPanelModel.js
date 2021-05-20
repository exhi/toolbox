import {GridModel, localDateCol, boolCheckCol} from '@xh/hoist/cmp/grid';
import {HoistModel, managed, persist, XH} from '@xh/hoist/core';
import {fmtCompactDate} from '@xh/hoist/format';
import {bindable, makeObservable} from '@xh/hoist/mobx';
import {PERSIST_APP} from './AppModel';
import {TaskDialogModel} from './TaskDialogModel';
import {isEmpty} from 'lodash';
import {LocalDate} from '@xh/hoist/utils/datetime';

export class TodoPanelModel extends HoistModel {

    persistWith = PERSIST_APP;

    @bindable
    @persist
    filterBy = 'all';

    @managed
    taskDialogModel = new TaskDialogModel(this);

    @managed
    gridModel = new GridModel({
        store: {
            fields: [
                {name: 'dueDate', type: 'localDate'}
            ]
        },
        emptyText: 'Empty todo list...',
        selModel: {mode: 'multiple'},
        enableExport: true,
        rowBorders: true,
        showHover: true,
        sortBy: 'dueDate',
        persistWith: this.persistWith,
        columns: [
            {
                field: 'description',
                flex: 1,
                tooltip: (description) => description
            },
            {
                field: 'complete',
                ...boolCheckCol,
                width: 80
            },
            {
                field: 'dueDate',
                ...localDateCol,
                width: 120,
                rendererIsComplex: true,
                renderer: (v, {record}) => {
                    if (v && v < LocalDate.today() && !record.data.complete) {
                        return fmtCompactDate(v, 'MMM D') + ' !';
                    } else {
                        return fmtCompactDate(v, 'MMM D');
                    }
                }
            }
        ]
    });

    get selectedTasks() {
        return this.gridModel.selection;
    }

    constructor() {
        super();
        makeObservable(this);

        const {gridModel} = this;

        this.addReaction({
            track: () => this.filterBy,
            run: (filterBy) => {
                switch (filterBy) {
                    case 'complete':
                        return gridModel.setFilter({field: 'complete', op: '=', value: true});
                    case 'active':
                        return gridModel.setFilter({field: 'complete', op: '=', value: false});
                    default:
                        return gridModel.setFilter(null);
                }
            },
            fireImmediately: true
        });
    }

    async addTaskAsync(task) {
        await XH.todoService.addTaskAsync(task);
        await this.refreshAsync();
        this.info(`Task added: '${task.description}'`);
    }

    async editTaskAsync(task) {
        await XH.todoService.editTaskAsync(task);
        await this.refreshAsync();
        this.info(`Task edited: '${task.description}'`);
    }

    async toggleCompleteAsync(isComplete) {
        const {selectedTasks} = this;
        if (isEmpty(selectedTasks)) return;

        for (const task of selectedTasks) {
            const {id, description, dueDate} = task.data;

            await XH.todoService.editTaskAsync({
                id,
                description,
                dueDate,
                complete: isComplete
            });
        }

        await this.refreshAsync();

        if (isComplete) {
            const count = selectedTasks.length,
                label = count === 1 ? `'${selectedTasks[0].data.description}!'` : `${count} tasks!`;
            this.info(`Congrats! You completed ${label}`);
        }
    }

    async removeTasksAsync() {
        const {selectedTasks} =  this;
        if (isEmpty(selectedTasks)) return;

        const count = selectedTasks.length,
            {description} = selectedTasks[0].data,
            message = count === 1 ? `'${description}?'` : `${count} tasks?`,
            remove = await XH.confirm({
                title: 'Confirm',
                message: `Are you sure you want to permanently remove ${message}`
            });

        if (remove) {
            const label = count === 1 ? `Task removed: '${description}'` : `${count} tasks removed`;

            for (const task of selectedTasks) {
                await XH.todoService.removeTasksAsync(task.data);
            }
            await this.refreshAsync();
            this.info(label);
        }
    }

    //------------------------
    // Implementation
    //------------------------
    async doLoadAsync(loadSpec) {
        const tasks = await XH.todoService.getTasksAsync();
        this.gridModel.loadData(tasks);
    }

    info(message) {
        XH.toast({message});
    }
}
