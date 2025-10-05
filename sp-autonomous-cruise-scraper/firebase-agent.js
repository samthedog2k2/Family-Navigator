const fs = require('fs');
const path = require('path');

class FirebaseAgent {
    constructor(logger) {
        this.logger = logger;
    }

    async saveData(cruiseData) {
        this.logger.info('Saving data to Firebase format...');

        try {
            // Create Firebase-compatible structure
            const firebaseData = {};
            const timestamp = new Date().toISOString().split('T')[0];

            cruiseData.forEach((cruise, index) => {
                firebaseData[cruise.id] = cruise;
            });

            // Save as JSON files
            const filename = `cruise-data-${timestamp}.json`;
            const firebaseFilename = `firebase-import-${timestamp}.json`;

            // Raw data file
            fs.writeFileSync(filename, JSON.stringify(cruiseData, null, 2));

            // Firebase import file
            fs.writeFileSync(firebaseFilename, JSON.stringify(firebaseData, null, 2));

            // Create summary
            const summary = {
                timestamp: new Date().toISOString(),
                totalRecords: cruiseData.length,
                sources: [...new Set(cruiseData.map(c => c.source))],
                priceRange: this.calculatePriceRange(cruiseData),
                topCruiseLines: this.getTopCruiseLines(cruiseData)
            };

            fs.writeFileSync(`summary-${timestamp}.json`, JSON.stringify(summary, null, 2));

            this.logger.info(`Data saved: ${filename}, ${firebaseFilename}`);

            return {
                success: true,
                files: [filename, firebaseFilename],
                recordCount: cruiseData.length
            };

        } catch (error) {
            this.logger.error('Firebase save error:', error);
            return { success: false, error: error.message };
        }
    }

    calculatePriceRange(cruises) {
        const prices = cruises
            .map(c => c.price)
            .filter(p => p && p.includes('$'))
            .map(p => parseInt(p.replace(/[$,]/g, '')))
            .filter(p => !isNaN(p));

        if (prices.length === 0) return null;

        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
        };
    }

    getTopCruiseLines(cruises) {
        const lines = {};
        cruises.forEach(cruise => {
            if (cruise.cruiseLine) {
                lines[cruise.cruiseLine] = (lines[cruise.cruiseLine] || 0) + 1;
            }
        });

        return Object.entries(lines)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([line, count]) => ({ line, count }));
    }
}

module.exports = FirebaseAgent;
