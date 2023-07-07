import { environment } from "src/environments/environment";

export default {

    oidc: {
        clientId: '0oa8877ayxEhdvMCI5d7',
        issuer: 'https://dev-76134060.okta.com/oauth2/default',
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }
}
