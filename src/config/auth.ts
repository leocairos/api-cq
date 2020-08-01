export default {
  jwt: {
    secret: process.env.APP_SECRET || 'mydeffdfdsaultsecretkey',
    expiresIn: '4h',
  },
};
