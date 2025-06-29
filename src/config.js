import dotenv from 'dotenv';
dotenv.config();

export const telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  apiUrl: 'https://api.telegram.org/bot'
};

export const weatherConfig = {
  yandexWeatherUrl: 'https://yandex.by/pogoda/ru/minsk?lat=53.902735&lon=27.555691',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
};