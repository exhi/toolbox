import {HoistModel, LoadSupport, managed, XH} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {DataViewModel} from '@xh/hoist/cmp/dataview';
import {roadmapDataViewItem} from './RoadmapDataViewItem';
import {roadmapGroupItem} from './RoadmapGroupItem';
import './RoadmapDataView.scss';

@HoistModel
@LoadSupport
export class RoadmapDataViewModel {

    constructor() {
        this.addReaction({
            track: () => this.showReleasedOnly,
            run: () => this.dataViewModel.store.setFilter(
                (record) => {
                    if (this.showReleasedOnly) {
                        return record.data.status === 'RELEASED';
                    } else {
                        return record.data.status !== 'RELEASED';
                    }
                }
            ),
            fireImmediately: true
        });
    }

    @bindable
    showReleasedOnly = false;

    @managed
    dataViewModel = new DataViewModel({
        store: {
            fields: ['name', 'category', 'description', 'releaseVersion', 'status', 'gitLinks', 'lastUpdated', 'lastUpdatedBy']
        },
        sortBy: 'name',
        itemHeight: 70,
        itemRenderer: (v, {record}) => roadmapDataViewItem({record}),
        groupBy: 'phaseOrder',
        groupedItemHeight: 30,
        groupRowRenderer: ({node}) => roadmapGroupItem({node}),
        contextMenu: [
            'copyCell',
            '-',
            'expandCollapseAll'
        ],
        emptyText: 'No projects found...',
        rowBorders: true,
        showHover: true,
        stripeRows: false,
        sizingMode: 'standard'
    });

    async doLoadAsync(loadSpec) {
        const {dataViewModel} = this,
            projects = await XH.fetchJson({url: 'rest/projectRest'});
        dataViewModel.loadData(projects.data);
    }
}