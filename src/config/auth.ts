export default {
  jwt: {
    secret: process.env.APP_SECRET || 'mydefaultsecretkey@123',
    expiresIn: '8h',
  },
};
