class MonitorAgent {
    constructor(logger) {
        this.logger = logger;
    }

    async checkDataQuality(cruiseData) {
        this.logger.info('Monitoring data quality...');

        const stats = {
            total: cruiseData.length,
            withPrices: cruiseData.filter(c => c.price).length,
            withShipNames: cruiseData.filter(c => c.shipName).length,
            withDeparturePorts: cruiseData.filter(c => c.departurePort).length,
            withItineraries: cruiseData.filter(c => c.itinerary).length,
            sources: [...new Set(cruiseData.map(c => c.source))]
        };

        const qualityScore = (
            (stats.withPrices / stats.total) * 0.3 +
            (stats.withShipNames / stats.total) * 0.3 +
            (stats.withDeparturePorts / stats.total) * 0.2 +
            (stats.withItineraries / stats.total) * 0.2
        );

        this.logger.info('Data quality stats:', stats);
        this.logger.info(`Overall quality score: ${(qualityScore * 100).toFixed(1)}%`);

        if (qualityScore < 0.5) {
            this.logger.warn('Data quality below threshold!');
        }

        return { stats, qualityScore };
    }
}

module.exports = MonitorAgent;
