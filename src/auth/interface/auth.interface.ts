export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
}
