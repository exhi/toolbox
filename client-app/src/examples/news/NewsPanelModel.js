import {HoistModel, managed, XH} from '@xh/hoist/core';
import {action, bindable, observable, makeObservable} from '@xh/hoist/mobx';
import {uniq} from 'lodash';
import {DataViewModel} from '@xh/hoist/cmp/dataview';
import {newsPanelItem} from './NewsPanelItem';
import {fmtCompactDate} from '@xh/hoist/format';

export class NewsPanelModel extends HoistModel {

    SEARCH_FIELDS = ['title', 'text'];

    @bindable storeFilterRaw = null;

    @managed
    viewModel = new DataViewModel({
        sortBy: 'published',
        store: {
            fields: ['title', 'source', 'text', 'url', 'imageUrl', 'author', 'published'],
            idSpec: XH.genId,
            filter: this.createFilter()
        },
        elementRenderer: (v, {record}) => newsPanelItem({record}),
        itemHeight: 120,
        rowBorders: true,
        stripeRows: true
    });

    @observable.ref sourceOptions = [];
    @observable lastRefresh = null;

    @bindable.ref sourceFilterValues = null;
    @bindable.ref textFilter = null;

    constructor() {
        super();
        makeObservable(this);
        this.addReaction({
            track: () => [this.sourceFilterValues, this.textFilter, this.lastRefresh],
            run: () => this.viewModel.setFilter(this.createFilter()),
            fireImmediately: true
        });
    }

    async doLoadAsync(loadSpec)  {
        await XH
            .fetchJson({url: 'news', loadSpec})
            .wait(100)
            .then(stories => this.completeLoad(stories));
    }

    //------------------------
    // Implementation
    //------------------------
    createFilter() {
        const {textFilter, sourceFilterValues} = this;
        return [
            textFilter,
            sourceFilterValues ? {field: 'source', op: '=', value: sourceFilterValues} : null
        ];
    }

    @action
    completeLoad(stories) {
        const {store} = this.viewModel;
        store.loadData(Object.values(stories).map((s) => {
            return {
                title: s.title,
                source: s.source,
                published: s.published ? fmtCompactDate(s.published) : null,
                text: s.text,
                url: s.url,
                imageUrl: s.imageUrl,
                author: s.author
            };
        }));
        this.sourceOptions = uniq(store.records.map(story => story.data.source));
        this.lastRefresh = new Date();
    }
}
