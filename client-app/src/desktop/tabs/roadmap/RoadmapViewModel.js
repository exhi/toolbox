import {HoistModel, LoadSupport, managed, XH} from '@xh/hoist/core';
import {bindable} from '@xh/hoist/mobx';
import {DataViewModel} from '@xh/hoist/cmp/dataview';
import {roadmapViewItem} from './RoadmapViewItem';
import {roadmapGroupItem} from './RoadmapGroupItem';
import './RoadmapView.scss';

@HoistModel
@LoadSupport
export class RoadmapViewModel {

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
            fields: ['name', 'phaseOrder', 'phaseName', 'category', 'description', 'releaseVersion', 'status', 'gitLinks', 'sortOrder', 'lastUpdated', 'lastUpdatedBy']
        },
        sortBy: 'sortOrder',
        itemHeight: 90,
        itemRenderer: (v, {record}) => roadmapViewItem({record}),
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
            resp = await XH.fetchJson({url: 'roadmap/data'});

        const projects = this.processData(resp.data);
        dataViewModel.loadData(projects);
    }

    processData(rawData) {
        return rawData.flatMap(phase => {
            return phase.projects.map(project => {
                return {...project, phaseOrder: phase.sortOrder, phaseName: phase.name};
            });
        });
    }
}