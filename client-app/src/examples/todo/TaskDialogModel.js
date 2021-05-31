import {HoistModel, managed} from '@xh/hoist/core';
import {
    FormModel,
    lengthIs,
    required
} from '@xh/hoist/cmp/form';
import {LocalDate} from '@xh/hoist/utils/datetime';
import {observable, action, makeObservable} from '@xh/hoist/mobx';

export class TaskDialogModel extends HoistModel {

    /** @member {TodoPanelModel} */
    parentModel;

    @observable
    isAdd = false;

    @observable
    isOpen = false;

    @managed
    formModel = new FormModel({
        fields: [
            {
                name: 'id'
            },
            {
                name: 'complete'
            },
            {
                name: 'description',
                rules: [required, lengthIs({max: 1000})]
            },
            {
                name: 'dueDate',
                displayName: 'Due Date'
            }
        ]
    });

    constructor(todoPanelModel) {
        super();
        makeObservable(this);

        this.parentModel = todoPanelModel;
    }

    reset() {
        this.formModel.reset();
    }

    async submitAsync() {
        const {formModel, parentModel} = this,
            {values} = formModel,
            isValid = await formModel.validateAsync();

        if (isValid) {
            const {description, dueDate, complete} = values,
                existingId = values.id,
                task = {
                    id: existingId ?? Date.now(),
                    description,
                    dueDate,
                    complete: complete ?? false
                };

            if (existingId) {
                await parentModel.editTaskAsync(task);
            } else {
                await parentModel.addTaskAsync(task);
            }

            this.close();
        }
    }

    @action
    openAddForm() {
        this.isAdd = true;
        this.isOpen = true;
        this.formModel.init({
            dueDate: LocalDate.today()
        });
    }

    @action
    openEditForm(task) {
        this.isAdd = false;
        this.isOpen = true;
        this.formModel.init(task);
    }

    @action
    close() {
        this.isOpen = false;
    }
}
