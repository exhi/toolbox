package io.xh.toolbox.mobile

import io.xh.hoist.security.Access
import io.xh.toolbox.BaseController


@Access(['APP_READER'])
class EmailMobileLinkController extends BaseController {

    def emailService

    def send() {
        try {
            emailService.sendEmail([
                    to: user.email,
                    subject: 'Your Link to the Toolbox Mobile App',
                    html: """
                        Click <a href="https://toolbox-dev.xh.io/mobile">here</a> from your mobile device to launch the 
                        Toolbox Mobile App.
                    """
            ])
            renderJSON([email: user.email, success: true])
        } catch(Exception e) {
            logErrorCompact('Something went wrong.', e)
            renderJSON([email: user.email, success: false])
        }
    }
}
