import fs from 'fs';

const localFiles = process.env.LOCAL_FILES;
const lockFile = `${localFiles}\\lock.lck`;

const SyncRecords = async (): Promise<void> => {
  try {
    if (!fs.existsSync(lockFile)) {
      console.log(`\n${new Date().toLocaleString()} Synchronizing records...`);

      // fs.closeSync(fs.openSync(lockFile, 'w'));

      // MySync function

      // fs.unlinkSync(lockFile);
    }
  } catch (err) {
    console.error(lockFile);
  }
};

export default SyncRecords;
