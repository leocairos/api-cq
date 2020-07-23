export default {
  jwt: {
    secret: process.env.APP_SECRET || 'mydefaultsecretkey',
    expiresIn: '4h',
  },
};
