import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import { join } from 'path';

const privateKey = readFileSync(join(__dirname, '../../keys/private.pem'), 'utf-8');
const publicKey = readFileSync(join(__dirname, '../../keys/public.pem'), 'utf-8');

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export interface AccessTokenPayload {
    sub: string;
    username: string;
    roles: string[];
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: ACCESS_TOKEN_EXPIRATION, issuer: 'auth-service' });
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'], issuer: 'auth-service' }) as AccessTokenPayload;
}

export const refreshTokenExpiry = (): Date => {
    return new Date(Date.now() + REFRESH_TOKEN_EXPIRATION); 
}