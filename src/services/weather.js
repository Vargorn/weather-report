import axios from 'axios';
import * as cheerio from 'cheerio';
import { weatherConfig } from '../config.js';
import { WEATHER_ICONS } from '../constants/weatherIcons.js';
import logger from './logger.js';

export const getYandexWeather = async () => {
  try {
    logger.info('Fetching weather data from Yandex...');

    const { data } = await axios.get(weatherConfig.yandexWeatherUrl, {
      headers: {
        'User-Agent': weatherConfig.userAgent
      },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    const forecasts = [];
    const $hourlyList = $('ul[class*="AppHourly_list"]');

    $hourlyList.find('li[class*="AppHourlyItem_container"]').each((_, element) => {
      const $item = $(element);

      const rawTime = $item.find('[class*="AppHourlyItem_content"] time').text().trim();
      const textBlock = $item.text();
      let time = rawTime;
      let temp = $item.find('[class*="AppHourlyItem_main"]').text().trim();
      const rain = $item.find('[class*="AppHourlyItem_secondary"]').text().trim();
      let icon = '❓';

      if (textBlock.includes('Закат')) {
        time = 'Закат';
        temp = rawTime || temp;
        icon = '🌇';
      } else if (textBlock.includes('Восход')) {
        time = 'Восход';
        temp = rawTime || temp;
        icon = '🌅';
      } else {
        const iconDiv = $item.find('div[class*="weatherIcon"]');
        const iconCode = iconDiv.attr('style')?.match(/--icon:(\d+)/)?.[1];
        icon = iconCode ? WEATHER_ICONS[iconCode] || '❓' : '❓';
      }

      forecasts.push({
        time,
        temp: temp || '',
        icon,
        rain: rain || undefined
      });
    });

    let summary = 'Нет предупреждений';
    const $warnings = $('div[class^="AppWarningsItemWarning"]');

    $warnings.each((_, warningElem) => {
      const $warning = $(warningElem);
      const $titleWrapper = $warning.find('div[class^="AppWarningsItemWarning_titleWrapper"]');
      const hasToday = $titleWrapper.find('span').filter((_, span) =>
        $(span).text().includes('Сегодня')
      ).length > 0;

      if (hasToday) {
        const text = $warning
          .find('p[class^="AppWarningsItemWarning_text"]')
          .text()
          .trim()
          .replace(/\s+/g, ' ');
        if (text) {
          summary = text;
          return false;
        }
      }
    });

    logger.info('Weather data successfully fetched');
    return { success: true, forecasts, summary };

  } catch (error) {
    logger.error('Failed to fetch weather data:', error);;
    return {
      success: false,
      error: error.message || 'Unknown Error'
    };
  }
};
