import fs from 'fs';
import logger from '@config/logger';

const schedule = (exec: () => {}): void => {
  const lockFile = `lock.lck`;

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
    }
  }, Number(process.env.INTERVAL_SINC_MYLIMS) * 1000);
};

export default schedule;
