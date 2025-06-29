import { getYandexWeather } from './services/weather.js';
import { formatWeather } from './utils/formatters.js';
import { sendWeatherMessage } from './services/telegram.js';
import { createScheduler } from './services/scheduler.js';
import logger from './services/logger.js';

async function sendWeatherReport() {
  try {
    const weather = await getYandexWeather();
    const message = formatWeather(weather);
    await sendWeatherMessage(message);
  } catch (error) {
    logger.error('Failed to send weather report:', error);
  }
}

const scheduler = createScheduler();
scheduler.scheduleDailyJob('3 */4 * * *', sendWeatherReport, 'Europe/Minsk');


sendWeatherReport().catch(error => {
  logger.error('Initial weather report failed:', error);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down...');
  scheduler.shutdown();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down...');
  scheduler.shutdown();
  process.exit(0);
});