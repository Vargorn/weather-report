import axios from 'axios';
import { telegramConfig } from '../config.js';
import logger from './logger.js';

export const sendWeatherMessage = async (text) => {
  try {
    logger.info('Sending Telegram message...');
    
    const response = await axios.post(
      `${telegramConfig.apiUrl}${telegramConfig.botToken}/sendMessage`,
      {
        chat_id: telegramConfig.chatId,
        text,
        parse_mode: 'Markdown'
      },
      { timeout: 5000 }
    );

    logger.info('Message sent successfully');
    return response.data;
    
  } catch (error) {
    logger.error('Failed to send Telegram message:', error.response?.data || error.message);
    throw error;
  }
};