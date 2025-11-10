import { AuthTokenPayload } from '../auth/token.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
