import { createLogger, format, transports } from 'winston';
import runMode from './runMode';

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

// define the custom settings for each transport (file, console)
const options = {
  file: {
    filename: `app-${runMode()}.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    json: true,
  },
  console: {
    handleExceptions: true,
    colorize: true,
    json: false,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message, encoding) {
    logger.info(message);
  },
};

export default logger;
