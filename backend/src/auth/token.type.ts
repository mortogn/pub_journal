export type AuthTokenPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  role: 'AUTHOR' | 'REVIEWER' | 'EDITOR' | 'ADMIN';
};
