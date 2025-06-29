export const formatWeather = (weather) => {
  if (!weather.success) {
    return `❌ Не удалось получить данные о погоде: ${weather.error}`;
  }

  let message = `🌍 *Прогноз погоды для Минска*\n\n`;
  const lines = [];

  let currentDay = null;

  weather.forecasts.forEach((hour) => {
    const timeText = hour.time;
    const dayMatch = timeText.match(/^([а-я]{2,}),/i);
    const newDay = dayMatch ? dayMatch[1] : null;

    if (newDay && newDay !== currentDay) {
      currentDay = newDay;
      lines.push(`\n📅 *${capitalizeDay(newDay)}*\n`);
    }

    lines.push(formatHour(hour));
  });

  message += lines.join('\n');

  if (weather.summary !== 'No alerts') {
    message += `\n\n📌 *Сводка*: ${weather.summary}`;
  }

  return message;
};

const formatHour = (hour) => {
  let line;

  if (hour.time === 'Восход') {
    line = `🌅 Восход: ${hour.temp}`;
  } else if (hour.time === 'Закат') {
    line = `🌇 Закат: ${hour.temp}`;
  } else {
    const timeLabel = formatTimeWithIcon(hour.time);
    line = `${timeLabel} ${hour.icon}`;

    if (hour.temp && hour.temp !== 'N/A') {
      line += ` ${hour.temp}`;
    }

    if (hour.rain && hour.rain !== 'undefined') {
      line += ` | 💧 ${formatRainValue(hour.rain)}`;
    }
  }

  return `- ${line}`;
};


const formatTimeWithIcon = (time) => {
  if (time === 'Восход') return '🌅 Восход';
  if (time === 'Закат') return '🌇 Закат';
  return time.replace(/([а-я]+),/i, (_, p1) => p1.slice(0, 3).toLowerCase() + ',');
};

const capitalizeDay = (abbr) => {
  return abbr.charAt(0).toUpperCase() + abbr.slice(1).toLowerCase();
};

const formatRainValue = (rain) => {
  const percentageMatch = rain.match(/\((\d+%)\)/);
  return percentageMatch ? percentageMatch[1] : rain;
};
