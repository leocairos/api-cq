interface IMailConfig {
  driver: 'ethereal' | 'ses' | 'smtp';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal' || 'smtp',

  defaults: {
    from: {
      email: process.env.MAIL_FROM_EMAIL,
      name: process.env.MAIL_FROM_NAME,
    },
  },
} as IMailConfig;
