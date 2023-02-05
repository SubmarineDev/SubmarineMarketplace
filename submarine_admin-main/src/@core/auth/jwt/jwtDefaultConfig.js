// ** Auth Endpoints
export default {
  loginEndpoint: '/api/jwt/login',
  registerEndpoint: '/api/jwt/register',
  refreshEndpoint: '/api/jwt/refresh-token',
  logoutEndpoint: '/api/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
