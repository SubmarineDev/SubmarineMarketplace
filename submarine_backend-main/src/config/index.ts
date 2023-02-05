import dotenv from "dotenv";
dotenv.config();

import KEYPAIR_DEV from './devnet.json';

export const jwtConfig = {
    secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
    refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
    expireTime: '30m',
    refreshTokenExpireTime: '30m'
}

export const BAD_REQUEST = { success: false, message: 'Bad Request', data: null }
export const BACKEND_ERROR = { success: false, message: 'Backend Server Error!', data: null }

export const PROGRAM_ID = '8GySHHvoDkQoTgW2oz6jDB6UsihRyHRJtyPCxZGtCA4U';
export const DELEGATE_SEED = 'delegate';
export const BID_SEED = 'bid';
export const VAULT_SEED = 'vault';
export const KEYPAIR = KEYPAIR_DEV;

export const {
    PG_HOST,
    PG_USER,
    PG_DATABASE,
    PG_PASSWORD,
    PORT,
    JWT_SECRET,
    CLUSTER_API
} = process.env;

export const PG_PORT = 5432