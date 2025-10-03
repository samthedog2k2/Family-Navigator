class DataAgent {
    constructor(logger) {
        this.logger = logger;
    }

    cleanText(text) {
        if (!text) return '';
        return text.replace(/\s+/g, ' ').trim();
    }

    extractPrice(priceText) {
        if (!priceText) return null;
        const match = priceText.match(/\$[\d,]+/);
        return match ? match[0] : priceText;
    }

    extractDuration(durationText) {
        if (!durationText) return null;
        const match = durationText.match(/(\d+)\s*(day|night)/i);
        return match ? parseInt(match[1]) : null;
    }

    processData(rawData) {
        this.logger.info('Processing raw cruise data...');

        const processed = rawData.map(cruise => {
            return {
                id: `cruise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: this.cleanText(cruise.title),
                shipName: this.cleanText(cruise.ship) || this.cleanText(cruise.title),
                cruiseLine: this.cleanText(cruise.line),
                price: this.extractPrice(cruise.price),
                departurePort: this.cleanText(cruise.departure),
                departureDate: this.cleanText(cruise.date),
                duration: this.extractDuration(cruise.duration),
                durationText: this.cleanText(cruise.duration),
                itinerary: this.cleanText(cruise.itinerary),
                link: cruise.link,
                source: cruise.source,
                scrapedAt: cruise.scrapedAt,
                processedAt: new Date().toISOString(),
                quality: this.assessQuality(cruise)
            };
        }).filter(cruise => cruise.quality > 0.3); // Filter low quality data

        // Remove duplicates
        const unique = this.removeDuplicates(processed);

        this.logger.info(`Processed ${unique.length} unique cruises`);
        return unique;
    }

    assessQuality(cruise) {
        let score = 0;
        if (cruise.title) score += 0.3;
        if (cruise.ship) score += 0.2;
        if (cruise.price) score += 0.2;
        if (cruise.departure) score += 0.1;
        if (cruise.itinerary) score += 0.1;
        if (cruise.date) score += 0.1;
        return score;
    }

    removeDuplicates(cruises) {
        const seen = new Set();
        return cruises.filter(cruise => {
            const key = `${cruise.shipName}_${cruise.departureDate}_${cruise.price}`.toLowerCase();
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
}

module.exports = DataAgent;
