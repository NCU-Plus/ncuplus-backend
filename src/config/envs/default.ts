export const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    redirectUrl: process.env.OAUTH_REDIRECT_URL,
  },
};
