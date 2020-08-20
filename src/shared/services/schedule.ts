import fs from 'fs';
import logger from '@config/logger';

const schedule = (exec: () => {}): void => {
  let lockFile = '';
  try {
    switch (process.argv[2].toUpperCase()) {
      case 'IMPORTALL':
        lockFile = `lock-import.lck`;
        break;
      case 'SYNC':
        lockFile = `lock-sync.lck`;
        break;
      default:
        lockFile = `lock.lck`;
        process.exit(1);
    }
  } catch {
    process.exit(1);
  }

  logger.info(
    `Execution of function '${exec.name}' every ${process.env.INTERVAL_SINC_MYLIMS} seconds`,
  );

  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
  }

  setInterval(() => {
    try {
      if (!fs.existsSync(lockFile)) {
        exec();
      }
    } catch (err) {
      logger.error(lockFile);
      if (fs.existsSync(lockFile)) {
        fs.unlinkSync(lockFile);
      }
    }
  }, Number(process.env.INTERVAL_SINC_MYLIMS) * 1000);
};

export default schedule;
