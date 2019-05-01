package io.xh.toolbox.recalls

import io.xh.hoist.security.AccessAll
import io.xh.toolbox.BaseController

@AccessAll
class RecallsController extends BaseController {

    def recallsService

    def index() {

        def recalls = recallsService.fetchRecalls(params.searchQuery)
        renderJSON(recalls)

        // or is it better to write:
        // renderJSON(recallsService.fetchRecalls())
        // ??
    }

}
