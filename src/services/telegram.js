export const sendWeatherMessage = async (text, chatIds) => {
  try {
    logger.info('Sending Telegram messages...');

    const results = await Promise.all(
      chatIds.map(async (chatId) => {
        const response = await axios.post(
          `${telegramConfig.apiUrl}${telegramConfig.botToken}/sendMessage`,
          {
            chat_id: chatId,
            text,
            parse_mode: 'Markdown'
          },
          { timeout: 5000 }
        );
        return response.data;
      })
    );

    logger.info('All messages sent successfully');
    return results;

  } catch (error) {
    logger.error('Failed to send one or more Telegram messages:', error.response?.data || error.message);
    throw error;
  }
};
