import {hoistCmp} from '@xh/hoist/core';
import {isRunningInOpenFin} from '@xh/hoist/openfin/utils';
import {openFinWindow} from '../../openfin/window';
import {fragment} from '@xh/hoist/cmp/layout';

export const windowWrapper = hoistCmp.factory(
    ({children}) => {
        if (isRunningInOpenFin()) {
            return openFinWindow(children);
        }

        return fragment(children);
    }
);