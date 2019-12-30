export declare class PortfolioService {
    MAX_POSITIONS: number;
    lookups: object[];
    initAsync(): Promise<void>;
    getSymbolsAsync(): Promise<any>;
    /**
     * Return a portfolio of hierarchically grouped positions for the selected dimension(s).
     * @param {string[]} dims - field names for dimensions on which to group.
     * @param {boolean} [includeSummary] - true to include a root summary node
     * @param {int} maxPositions - truncate position tree, by smallest pnl, until this number positions is reached
     * @return {Promise<Array>}
     */
    getPositionsAsync(dims: any, includeSummary?: boolean, maxPositions?: number): Promise<any>;
    /**
     * Return a single grouped position, uniquely identified by drilldown ID.
     * @param positionId - ID installed on each position returned by `getPositionsAsync()`.
     * @return {Promise<*>}
     */
    getPositionAsync(positionId: any): Promise<any>;
    /**
     *  Return a PositionSession that will receive live updates.
     *  See getPositionsAsync(), the static form of this method, for more details.
     *
     * @returns {Promise<PositionSession>}
     */
    getLivePositionsAsync(dims: any, topic: any, maxPositions?: number): Promise<any>;
    /**
     * Return a list of flat position data.
     * @returns {Promise<Array>}
     */
    getRawPositionsAsync(): Promise<any>;
    getAllOrdersAsync(): Promise<any>;
    getOrdersAsync(positionId: any): Promise<any>;
    getLineChartSeriesAsync(symbol: any, dimension?: string): Promise<{
        name: any;
        type: string;
        animation: boolean;
        data: any;
    }>;
    getOHLCChartSeriesAsync(symbol: any): Promise<{
        name: any;
        type: string;
        color: string;
        upColor: string;
        animation: boolean;
        dataGrouping: {
            enabled: boolean;
        };
        data: any;
    }>;
}
