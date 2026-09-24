const fs = require('fs');
const path = require('path');

const getTimestamp = () => new Date().toISOString();

const sanitizeData = (data) => {
  if (!data) return data;
  if (typeof data !== 'object') return data;
  const clone = Array.isArray(data) ? [...data] : { ...data };
  const sensitiveKeys = ['password', 'confirmPassword', 'token', 'jwt', 'secret', 'authorization'];
  for (const key of Object.keys(clone)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      clone[key] = '***REDACTED***';
    } else if (typeof clone[key] === 'object') {
      clone[key] = sanitizeData(clone[key]);
    }
  }
  return clone;
};

const writeToFile = (level, message, meta = null) => {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') return;
  try {
    const logDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logLine = `[${getTimestamp()}] [${level.toUpperCase()}] ${message} ${
      meta ? JSON.stringify(sanitizeData(meta)) : ''
    }\n`;
    fs.appendFileSync(path.join(logDir, 'app.log'), logLine);
  } catch (err) {
    // Ignore file write errors
  }
};

const logger = {
  info: (message, meta = null) => {
    console.log(`\x1b[36m[INFO]\x1b[0m [${getTimestamp()}] ${message}`, meta ? sanitizeData(meta) : '');
    writeToFile('info', message, meta);
  },
  warn: (message, meta = null) => {
    console.warn(`\x1b[33m[WARN]\x1b[0m [${getTimestamp()}] ${message}`, meta ? sanitizeData(meta) : '');
    writeToFile('warn', message, meta);
  },
  error: (message, meta = null) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m [${getTimestamp()}] ${message}`, meta ? sanitizeData(meta) : '');
    writeToFile('error', message, meta);
  },
  auth: (message, meta = null) => {
    console.log(`\x1b[35m[AUTH]\x1b[0m [${getTimestamp()}] ${message}`, meta ? sanitizeData(meta) : '');
    writeToFile('auth', message, meta);
  }
};

module.exports = logger;
