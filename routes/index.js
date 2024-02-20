import express from 'express';
import { AuthorizationCode } from 'simple-oauth2'
import got from 'got'
import Twitter from 'twitter-lite';

import { googleClientConfig, googleConfig, fbClientConfig, fbConfig, xConfig, discordConfig, discordClientConfig } from './config.js'

const gClient = new AuthorizationCode(googleClientConfig)
const fbClient = new AuthorizationCode(fbClientConfig)
const xClient = new Twitter({
  consumer_key: xConfig.CLIENT_ID,
  consumer_secret: xConfig.CLIENT_SECRET
})
const discordClient = new AuthorizationCode(discordClientConfig)

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/google', (req, res) => {
  const authURL = gClient.authorizeURL({
    scope: 'profile email',
    redirect_uri: googleConfig.CALLBACK_URL,
  })

  res.redirect(authURL)
})

router.get('/auth/google/callback', async (req, res) => {
  const params = {
    code: req.query.code,
    redirect_uri: googleConfig.CALLBACK_URL,
    scope: 'profile email'
  }

  const accessToken = await gClient.getToken(params)

  const response = await got.get(googleConfig.PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken.token.access_token}`
    }
  }).json()


  res.json(response)
})

router.get('/auth/facebook', (req, res) => {
  const authURL = fbClient.authorizeURL({
    redirect_uri: fbConfig.CALLBACK_URL,
  })

  res.redirect(authURL)
})

router.get('/auth/facebook/callback', async (req, res) => {
  const params = {
    code: req.query.code,
    redirect_uri: fbConfig.CALLBACK_URL,
  }

  try {
    const accessToken = await fbClient.getToken(params)

    const response = await got.get(fbConfig.PROFILE_URL, {
      searchParams: {
        access_token: accessToken.token.access_token,
        fields: 'id,first_name,last_name,middle_name,name,email,picture'
      }
    }).json()

    res.json(response)
  } catch (err) {
    console.error(err)
    res.json({
      error: err.message
    })
  }
})

// Two ways
// This is using Oauth2; does not include email
// router.get('/auth/twitter', async (req, res) => {
// try {
//   await got.post('https://api.twitter.com/oauth/request_token', {
//     form: {
//       oauth_callback: 'http://localhost:3010/auth/twitter/callback',
//       oauth_verifier: '3256564394-lgqVd79BrPBJs19CbajSVt1PyiR8vzDZUrySWV6',
//       oauth_token: 'I9opQdaQcCXEYZdjEutsRLMJxxZmP2Qu8lI9XIfdaFraP'
//     }
//   })
// } catch (err) {
//   console.log('err', err.response.body)
//   return res.json({
//     error: err.message
//   })
// }
// const url = 'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=blZLSkZzZFhFRUR0Z3N3c3BRc1E6MTpjaQ&redirect_uri=http://localhost:3010/auth/twitter/callback&scope=users.read tweet.read&state=state&code_challenge=code_challenge&code_challenge_method=plain'

// res.redirect(url)
// })

// router.get('/auth/twitter/callback', async (req, res) => {
//   try {
//     const accessToken = await got.post('https://api.twitter.com/2/oauth2/token', {
//       headers: {
//         'Authorization': `Basic YmxaTFNrWnpaRmhGUlVSMFozTjNjM0JSYzFFNk1UcGphUTpKOTdkZUc1ZHh5Um9wek41dTdXaDlXV0JWcG1FcVpyQjE0dHlsMWdJT0VxcGZvTWZDeg==`
//       },
//       form: {
//         code: req.query.code,
//         grant_type: 'authorization_code',
//         client_id: 'blZLSkZzZFhFRUR0Z3N3c3BRc1E6MTpjaQ',
//         redirect_uri: 'http://localhost:3010/auth/twitter/callback',
//         code_verifier: 'code_challenge'
//       }
//     }).json()

//     console.log('accessToken', accessToken);

//     const response = await got.get('https://api.twitter.com/2/users/me', {
//       headers: {
//         'Authorization': `Bearer ${accessToken.access_token}`
//       },
//       searchParams: {
//         'user.fields': 'id,created_at,description,entities,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'
//       }
//     }).json()

//     res.json(response)
//   } catch (err) {
//     res.json({
//       error: err.message
//     })
//   }
// })

// This is using Oauth1; includes email
router.get('/auth/twitter', async (req, res) => {
  const token = await xClient.getRequestToken(xConfig.CALLBACK_URL)

  const oauth_token = token.oauth_token
  const oauth_token_secret = token.oauth_token_secret

  const url = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}&oauth_token_secret=${oauth_token_secret}&oauth_callback_confirmed=true`
  res.redirect(url)
})

router.get('/auth/twitter/callback', async (req, res) => {
  const accessToken = await xClient.getAccessToken({
    oauth_verifier: req.query.oauth_verifier,
    oauth_token: req.query.oauth_token
  })

  const client = new Twitter({
    consumer_key: xConfig.CLIENT_ID,
    consumer_secret: xConfig.CLIENT_SECRET,
    access_token_key: accessToken.oauth_token,
    access_token_secret: accessToken.oauth_token_secret
  })

  try {

    const response = await client.get(xConfig.PROFILE_URL, {
      id: accessToken.user_id,
      skip_status: true,
      include_email: true,
      include_entities: true
    })

    res.json(response)
  } catch (err) {
    console.log('err', err);
    console.log('err', err?.response)
    res.json({
      error: err.message
    })
  }
})

router.get('/auth/discord', (req, res) => {
  const authURL = discordClient.authorizeURL({
    redirect_uri: discordConfig.CALLBACK_URL,
    scope: 'email identify'
  })

  res.redirect(authURL)
})

router.get('/auth/discord/callback', async (req, res) => {
  const params = {
    code: req.query.code,
    redirect_uri: discordConfig.CALLBACK_URL,
  }

  try {
    const accessToken = await discordClient.getToken(params)
    console.log('accessToken', accessToken);

    const response = await got.get(discordConfig.PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken.token.access_token}`
      }
    }).json()

    res.json(response)
  } catch (err) {
    console.log('err', err);
    console.error('err', err?.response?.body)
    res.json({
      error: err.message
    })
  }
})

export default router
