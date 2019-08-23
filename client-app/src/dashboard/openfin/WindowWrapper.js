import {hoistElemFactory} from '@xh/hoist/core';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {openFinWindow} from '../../openfin/window';
import {fragment} from '@xh/hoist/cmp/layout';

export const windowWrapper = hoistElemFactory(props => {
    if (isRunningInOpenFin()) {
        return openFinWindow(props.children);
    }

    return fragment(props.children);
});