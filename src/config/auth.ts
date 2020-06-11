export interface TokenConfig {
    app_secret: string;
    expires_in: string;
}

const TokenConfig: TokenConfig = {
    app_secret: process.env.APP_SECRET,
    expires_in: '7d'
}

export default TokenConfig