import cron from 'node-cron';
import logger from './logger.js';

export const createScheduler = () => {
  const jobs = [];

  return {
    scheduleDailyJob: (time, task, timezone) => {
      logger.info(`Scheduling daily job for ${time} (${timezone})`);
      
      const job = cron.schedule(time, async () => {
        try {
          logger.info('Running scheduled job...');
          await task();
        } catch (error) {
          logger.error('Job failed:', error);
        }
      }, {
        scheduled: true,
        timezone
      });

      jobs.push(job);
      return job;
    },
    shutdown: () => {
      jobs.forEach(job => job.stop());
      logger.info('Scheduler shutdown completed');
    }
  };
};