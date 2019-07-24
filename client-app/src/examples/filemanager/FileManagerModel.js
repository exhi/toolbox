import {HoistModel, LoadSupport, XH, managed} from '@xh/hoist/core';
import {GridModel, fileExtCol} from '@xh/hoist/cmp/grid';
import {actionCol, calcActionColWidth} from '@xh/hoist/desktop/cmp/grid';
import {computed} from '@xh/hoist/mobx';
import {Icon} from '@xh/hoist/icon';
import {FileChooserModel} from '@xh/hoist/desktop/cmp/filechooser';
import filesize from 'filesize';
import download from 'downloadjs';
import {filter, last, find, pull} from 'lodash';

@HoistModel
@LoadSupport
export class FileManagerModel {

    @managed
    chooserModel = new FileChooserModel();
    
    @managed
    gridModel = new GridModel({
        store: {
            fields: [
                'name', 'extension', 'size', 'status', 'file'
            ],
            idSpec: 'name'
        },
        sortBy: 'name',
        groupBy: 'status',
        emptyText: 'No files uploaded or queued for upload...',
        columns: [
            {
                field: 'extension',
                ...fileExtCol
            },
            {field: 'name', flex: 1},
            {
                field: 'size',
                width: 90,
                align: 'right',
                renderer: v => filesize(v)
            },
            {
                field: 'status',
                hidden: true,
                width: 120
            },
            {
                ...actionCol,
                width: calcActionColWidth(1),
                actions: [
                    {
                        icon: Icon.delete(),
                        tooltip: 'Remove file',
                        intent: 'danger',
                        displayFn: ({record}) => {
                            return {hidden: record.status == 'Pending Delete'};
                        },
                        actionFn: ({record}) => {
                            this.removeFile(record);
                        }
                    },
                    {
                        icon: Icon.undo(),
                        tooltip: 'Restore file',
                        intent: 'primary',
                        displayFn: ({record}) => {
                            return {hidden: record.status != 'Pending Delete'};
                        },
                        actionFn: ({record}) => {
                            this.restoreFile(record);
                        }
                    }
                ]
            }
        ]
    });

    @computed
    get pendingChangeCount() {
        return this.getFilesToDelete().length + this.chooserModel.files.length;
    }

    @computed
    get enableDownload() {
        const sel = this.gridModel.selectedRecord;
        return sel && sel.status != 'Pending Upload';
    }

    constructor() {
        this.addReaction({
            track: () => this.chooserModel.files,
            run: this.syncWithChooser
        });
    }

    async doLoadAsync(loadSpec) {
        const files = await XH.fetchService
            .fetchJson({
                url: 'fileManager/list',
                loadSpec
            })
            .track({
                category: 'File Manager',
                message: 'Loaded Files',
                loadSpec
            })
            .catchDefault();

        files.forEach(file => {
            file.extension = this.getExtension(file.name);
            file.status = 'Saved';
        });

        this.gridModel.loadData(files);
    }

    async saveAsync() {
        let uploadPromise,
            deletePromise;

        const uploads = this.chooserModel.files;
        if (uploads.length) {
            const formData = new FormData();
            uploads.forEach((file, idx) => {
                formData.append(`file-${idx}`, file, file.name);
            });

            uploadPromise = XH.fetch({
                url: 'fileManager/upload',
                method: 'POST',
                body: formData,
                headers: {'Content-Type': null}
            });
        }

        const deletes = this.getFilesToDelete();
        if (deletes.length) {
            deletePromise = Promise.all(deletes.map(it => {
                XH.fetchService
                    .fetchJson({
                        url: 'fileManager/delete',
                        params: {filename: it.name}
                    })
                    .then(ret => {
                        if (!ret.success) throw `Unable to delete ${it.name}`;
                    })
                    .catchDefault();
            }));
        }

        return Promise
            .all([
                uploadPromise,
                deletePromise
            ])
            .then(() => {
                return this.resetAndLoadAsync();
            })
            .then(() => {
                XH.toast({
                    message: `Files processed successfully: ${uploads.length} uploaded | ${deletes.length} deleted.`
                });
            })
            .catchDefault();
    }

    async resetAndLoadAsync() {
        this.chooserModel.removeAllFiles();
        this.loadAsync();
    }

    async downloadSelectedAsync() {
        if (!this.enableDownload) return;

        const sel = this.gridModel.selectedRecord,
            response = await XH.fetch({
                url: 'fileManager/download',
                params: {filename: sel.name}
            }).catchDefault();

        const blob = await response.blob();
        download(blob, sel.name);
        XH.toast({
            icon: Icon.download(),
            message: 'Download complete.'
        });
    }

    // Mark already-uploaded file as pending deletion on save, or immediately remove a
    // not-yet-uploaded file from the chooser.
    removeFile(file) {
        const {status} = file;

        if (status == 'Saved') {
            // Already uploaded record - change status directly in grid store.
            this.setFileStatus(file.id, 'Pending Delete');
        } else if (status == 'Pending Upload') {
            // Ask chooser to remove - reaction on chooser files[] will update grid store.
            this.chooserModel.removeFileByName(file.name);
        }
    }

    // Restore a file marked as "Pending Delete" - i.e. cancel delete request.
    restoreFile(file) {
        if (file.status == 'Pending Delete') {
            this.setFileStatus(file.id, 'Saved');
        }
    }

    // Update the status of an existing record.
    setFileStatus(id, newStatus) {
        const store = this.getStore(),
            rec = store.getById(id),
            newData = {...rec.raw, status: newStatus};

        store.updateData([newData]);
    }

    syncWithChooser() {
        const chooserModel = this.chooserModel;

        // Get all non-chooser file data.
        const newData = this.getServerSideFiles();

        // Mix in copy of chooser files.
        chooserModel.files.forEach(newFile => {
            // A chooser file of the same name will replace any current file.
            const dupeFile = find(newData, {name: newFile.name});
            if (dupeFile) pull(newData, dupeFile);

            newData.push({
                name: newFile.name,
                extension: this.getExtension(newFile.name),
                size: newFile.size,
                status: 'Pending Upload',
                file: newFile
            });
        });

        // Reload the store.
        this.getStore().loadData(newData);
    }

    getFilesToDelete() {
        return filter(this.getAllData(), {status: 'Pending Delete'});
    }

    getServerSideFiles() {
        return filter(this.getAllData(), (it) => it.status != 'Pending Upload');
    }

    getAllData() {
        return this.getStore().allRecords.map(it => it.raw);
    }

    getStore() {
        return this.gridModel.store;
    }

    getExtension(filename) {
        return last(filename.split('.'));
    }

}