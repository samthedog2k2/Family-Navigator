#!/usr/bin/env node

/**
 * SP Autonomous Cruise Data Collection System
 * Complete replacement for n8n/AirTop with intelligent agents
 */

const ScraperAgent = require('./scraper-agent-simple');
const DataAgent = require('./data-agent');
const FirebaseAgent = require('./firebase-agent');
const MonitorAgent = require('./monitor-agent');
const cron = require('cron');
const winston = require('winston');

class SPAutonomousOrchestrator {
    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'cruise-scraper.log' })
            ]
        });

        this.agents = {
            scraper: new ScraperAgent(this.logger),
            data: new DataAgent(this.logger),
            firebase: new FirebaseAgent(this.logger),
            monitor: new MonitorAgent(this.logger)
        };

        this.isRunning = false;
    }

    async executeDataCollection() {
        if (this.isRunning) {
            this.logger.warn('Data collection already in progress');
            return;
        }

        this.isRunning = true;
        this.logger.info('Starting autonomous cruise data collection...');

        try {
            // Phase 1: Scrape data from multiple sources
            const rawData = await this.agents.scraper.collectCruiseData();
            this.logger.info(`Collected ${rawData.length} raw cruise records`);

            // Phase 2: Process and clean data
            const cleanData = await this.agents.data.processData(rawData);
            this.logger.info(`Processed ${cleanData.length} clean cruise records`);

            // Phase 3: Save to Firebase
            const saveResult = await this.agents.firebase.saveData(cleanData);
            this.logger.info(`Saved to Firebase: ${saveResult.success ? 'SUCCESS' : 'FAILED'}`);

            // Phase 4: Monitor results
            await this.agents.monitor.checkDataQuality(cleanData);

            this.logger.info('Autonomous data collection completed successfully');

            return {
                success: true,
                recordsCollected: rawData.length,
                recordsProcessed: cleanData.length,
                firebaseSaved: saveResult.success
            };

        } catch (error) {
            this.logger.error('Data collection failed:', error);
            return { success: false, error: error.message };
        } finally {
            this.isRunning = false;
        }
    }

    startScheduledCollection() {
        // Run every 6 hours
        const job = new cron.CronJob('0 */6 * * *', async () => {
            await this.executeDataCollection();
        });

        job.start();
        this.logger.info('Scheduled collection started (every 6 hours)');
    }

    async runOnce() {
        return await this.executeDataCollection();
    }
}

// Main execution
async function main() {
    const orchestrator = new SPAutonomousOrchestrator();

    if (process.argv.includes('--schedule')) {
        orchestrator.startScheduledCollection();
        console.log('Autonomous cruise scraper running with schedule...');
        process.stdin.resume(); // Keep process alive
    } else {
        console.log('Running one-time data collection...');
        const result = await orchestrator.runOnce();
        console.log('Result:', result);
        process.exit(result.success ? 0 : 1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = SPAutonomousOrchestrator;
