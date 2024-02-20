export const googleConfig = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  CALLBACK_URL: 'http://localhost:3010/auth/google/callback',
  PROFILE_URL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}

export const googleClientConfig = {
  client: {
    id: googleConfig.CLIENT_ID,
    secret: googleConfig.CLIENT_SECRET
  },
  auth: {
    authorizeHost: 'https://accounts.google.com',
    authorizePath: '/o/oauth2/v2/auth',
    tokenHost: 'https://www.googleapis.com',
    tokenPath: '/oauth2/v4/token'
  }
}

export const fbConfig = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  CALLBACK_URL: 'http://localhost:3010/auth/facebook/callback',
  PROFILE_URL: 'https://graph.facebook.com/v19.0/me'
}

export const fbClientConfig = {
  client: {
    id: fbConfig.CLIENT_ID,
    secret: fbConfig.CLIENT_SECRET,
  },
  auth: {
    authorizeHost: 'https://facebook.com',
    authorizePath: '/v19.0/dialog/oauth',
    tokenHost: 'https://graph.facebook.com',
    tokenPath: '/v19.0/oauth/access_token'
  }
}

export const xConfig = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  CALLBACK_URL: 'http://localhost:3010/auth/twitter/callback',
  PROFILE_URL: 'account/verify_credentials'
}

export const discordConfig = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  CALLBACK_URL: 'http://localhost:3010/auth/discord/callback',
  PROFILE_URL: 'https://discord.com/api/users/@me'
}

export const discordClientConfig = {
  client: {
    id: discordConfig.CLIENT_ID,
    secret: discordConfig.CLIENT_SECRET,
  },
  auth: {
    authorizeHost: 'https://discord.com',
    authorizePath: '/api/oauth2/authorize',
    tokenHost: 'https://discord.com',
    tokenPath: '/api/oauth2/token',
  }
}