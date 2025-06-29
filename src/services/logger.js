import fs from 'fs';
import path from 'path';

const logDir = './logs';
const logFile = path.join(logDir, 'weather.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').split('.')[0];
};

const writeToFile = (level, ...args) => {
  const line = `[${timestamp()}] [${level}] ${args.map(String).join(' ')}\n`;
  fs.appendFile(logFile, line, err => {
    if (err) console.error('[ERROR] Failed to write to log file:', err);
  });
};

export default {
  info: (...args) => {
    console.log('[INFO]', ...args);
    writeToFile('INFO', ...args);
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
    writeToFile('ERROR', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
    writeToFile('WARN', ...args);
  }
};
