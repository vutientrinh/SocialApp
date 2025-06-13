export const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const CHECK_TOKEN_URL = BASE_URL + "api/auth/checkToken";

export const CHECK_TOKEN_ADMIN_URL = BASE_URL + "api/auth/checkTokenOfAdmin";

export const CHECK_TOKEN_ROLE_ADMIN = BASE_URL + "api/auth/checkTokenRoleAdmin"; // check later

export const SOCKET_URL = BASE_URL + "ws";
