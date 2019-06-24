import { configure, getLogger, Logger } from 'log4js';

configure({
    appenders: {
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'trace' }
    }
});
export const logger: Logger = getLogger();

logger.level = 'debug';
