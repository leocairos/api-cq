import fs from 'fs';
// import readXLS from './readXLS';
// import controller from '../controller';

const localFiles = process.env.LOCAL_FILES;
const lockFile = `${localFiles}\\lock.lck`;

const SyncRecords = async () => {
  try {
    if (!fs.existsSync(lockFile)) {
      console.log(`\n${new Date().toLocaleString()} Synchronizing records...`);

      await fs.closeSync(await fs.openSync(lockFile, 'w'));

      await fs.unlinkSync(lockFile);
    }
  } catch (err) {
    console.error(lockFile);
  }
};

export default SyncRecords;
