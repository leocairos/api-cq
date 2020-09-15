interface IMailConfig {
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  defaults: {
    from: {
      email: process.env.SMTP_USER,
      name: process.env.SMTP_NAME,
    },
  },
} as IMailConfig;
