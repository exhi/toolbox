package io.xh.toolbox.portfolio

import groovy.util.logging.Slf4j
import io.xh.hoist.json.JSONFormat
import io.xh.hoist.util.Utils

@Slf4j
class PositionSession implements JSONFormat {

    final String id
    final String channelKey
    final String topic

    private PositionResultSet positions


    PositionSession(PositionQuery query, String channelKey, String topic) {
        this.id = [channelKey, topic].join('||')
        this.channelKey = channelKey
        this.topic = topic
        this.positions = positionService.getPositions(query)
    }

    void pushUpdate() {
        PositionResultSet newPositions = positionService.getPositions(positions.query)

        // find changed positions, and send them as a flat list of updates.
        Map<String, Position> oldPositionMap = getMappedPositions(positions.root)
        Map<String, Position> newPositionMap = getMappedPositions(newPositions.root)

        def oldIds = oldPositionMap.keySet()
        def newIds = newPositionMap.keySet()

        PositionUpdate posUpdate

        if (oldIds == newIds) {
            List<Position> changedPositions = oldIds.findAll { id ->
                Position oldPos = oldPositionMap[id]
                Position newPos = newPositionMap[id]
                // Position tree structure is the same in new positions and old, as only prices have changed.
                // So, positions are different iff their pnl and/or mktVal values differ.
                if (!newPos || !oldPos) {
                    log.error("Position ${id} is null in ${!newPos ? 'new' : 'old'}PositionsMap")
                    return false
                }
                return (newPos.pnl != oldPos.pnl || newPos.mktVal != oldPos.mktVal)
            }.collect { id -> newPositionMap[id] }

            changedPositions.each { it.children = null }

            posUpdate = new PositionUpdate(isFull: false, positions: changedPositions)
        } else {
            // If tree structure changed, we send a full update
            posUpdate = new PositionUpdate(isFull: true, positions: [newPositions.root])
        }
        Utils.webSocketService.pushToChannel(channelKey, topic, posUpdate)
    }


    //--------------------
    // Implementation
    //--------------------

    private Map<String, Position> getMappedPositions(Position root) {
        Map<String, Position> ret = [:]
        Closure<Void> addToPositionMapRecursive
        addToPositionMapRecursive = { Position pos ->
            ret[pos.id] = pos
            if (pos.children) {
                pos.children.each { childPos ->
                    addToPositionMapRecursive(childPos)
                }
            }
            return
        }
        addToPositionMapRecursive(root)
        return ret
    }

    private PositionService getPositionService() {
        Utils.appContext.positionService
    }

    void destroy() {

    }

    Object formatForJSON() {
        return [
                id: id,
                channelKey: channelKey,
                topic: topic,
                positions: positions
        ]
    }
}