import {hoistCmp, XH} from '@xh/hoist/core';
import {vframe} from '@xh/hoist/cmp/layout';
import {button} from '@xh/hoist/desktop/cmp/button';
import {useState} from 'react';
import {Icon} from '@xh/hoist/icon/Icon';

export const [LocalWindowActionPanel, localWindowActionPanel] = hoistCmp.withFactory({
    render() {
        const [shouldThrow, setShouldThrow] = useState(false);

        if (shouldThrow) {
            throw XH.exception('Render Exception!');
        }

        return vframe({
            items: [
                button({
                    text: 'Show Toast',
                    intent: 'success',
                    icon: Icon.info(),
                    onClick: () => XH.toast({
                        message: 'Hello World!'
                    })
                }),
                button({
                    text: 'Show Alert',
                    intent: 'primary',
                    icon: Icon.comment(),
                    onClick: () => XH.alert({
                        message: 'Hello World!'
                    })
                }),
                button({
                    text: 'Throw Exception',
                    intent: 'warning',
                    icon: Icon.warning(),
                    onClick: () => XH.handleException(XH.exception('Uh Oh!'))
                }),
                button({
                    text: 'Throw Render Exception',
                    intent: 'danger',
                    icon: Icon.error(),
                    onClick: () => setShouldThrow(true)
                })
            ]
        });
    }
});