import logger from './logger';

const runMode = (): string => {
  try {
    switch (process.argv[2].toUpperCase()) {
      case 'IMPORTALL':
        return 'importAll';
      case 'SYNC':
        return 'sync';
      case 'API':
        return 'api';
      // case 'REPROCESSTASKS':
      //   return 'reprocessTasks';
      default:
        return 'noParms';
    }
  } catch {
    return 'noParms';
  }
};

const appPort = (): number => {
  let appPortAux = Number(process.env.APP_PORT || 3039);

  switch (runMode()) {
    case 'importAll':
      appPortAux += 0;
      break;
    case 'sync':
      appPortAux += 1;
      break;
    case 'api':
      appPortAux += 2;
      break;
    // case 'reprocessTasks':
    //   appPortAux += 2;
    //   break;
    default:
      logger.warn('Sorry, that is not something I know how to do.');
      process.exit(1);
  }

  return appPortAux;
};

export { runMode, appPort };
