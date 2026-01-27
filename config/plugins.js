module.exports = () => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'lotusdreamspa.sr@gmail.com', // La tua mail gmail
          pass: 'kmlheebvtsltoqql', // La "App Password" di 16 caratteri generata prima
        },
      },
      settings: {
        defaultFrom: 'lotusdreamspa.sr@gmail.com', // O la tua mail
        defaultReplyTo: 'lotusdreamspa.sr@gmail.com',
      },
    },
  },
});