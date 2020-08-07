import fs from 'fs';

const schedule = exec => {
  const lockFile = `lock.lck`;

  console.log(
    `\r${new Date().toLocaleString()} Execution of function '${
      exec.name
    }' every ${process.env.INTERVAL_SINC_MYLIMS} seconds`,
  );

  setInterval(() => {
    try {
      if (!fs.existsSync(lockFile)) {
        exec();
      }
    } catch (err) {
      console.error(lockFile);
    }
  }, process.env.INTERVAL_SINC_MYLIMS * 1000);
};

export default schedule;
