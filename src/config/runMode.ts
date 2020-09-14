const runMode = (): string => {
  try {
    switch (process.argv[2].toUpperCase()) {
      case 'IMPORTALL':
        return 'importAll';
      case 'SYNC':
        return 'sync';
      case 'API':
        return 'api';
      default:
        return 'noParms';
    }
  } catch {
    return 'noParms';
  }
};

export default runMode;
