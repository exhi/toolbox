import {GridModel} from '@xh/hoist/cmp/grid';
import {emptyFlexCol} from '@xh/hoist/cmp/grid/columns';
import {HoistModel, XH} from '@xh/hoist/core';
import {managed} from '@xh/hoist/core/mixins';
import {dateRenderer} from '@xh/hoist/format';
import {bindable} from '@xh/hoist/mobx';

@HoistModel
export class WebSocketTestModel {

    @managed gridModel;
    @managed updateSub;
    @bindable subscribed = false;

    constructor() {
        this.gridModel = new GridModel({
            sortBy: [{colId: 'timestamp', sort: 'desc'}],
            emptyText: 'No updates received',
            columns: [
                {field: 'id', headerName: 'ID', width: 80},
                {field: 'timestamp', width: 200, renderer: dateRenderer({fmt: 'h:mm:ssa'})},
                {...emptyFlexCol}
            ]
        });

        this.updateSub = XH.webSocketService.subscribe('mockUpdate', (msg) => this.onUpdateMessage(msg));
    }

    onUpdateMessage(msg) {
        this.gridModel.store.updateData([msg.data]);
    }

    async subscribeAsync() {
        await XH.fetchJson({
            url: 'mockUpdates/subscribe',
            params: {channelKey: XH.webSocketService.channelKey}
        });

        XH.toast({message: 'Subscribed to updates.'});
        this.setSubscribed(true);
    }

    async unsubscribeAsync() {
        await XH.fetchJson({
            url: 'mockUpdates/unsubscribe',
            params: {channelKey: XH.webSocketService.channelKey}
        });

        XH.toast({message: 'Unsubscribed from updates.', intent: 'danger'});
        this.setSubscribed(false);
    }

}