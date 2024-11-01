import 'express';

export interface UserInfo {
  id: string;
  email?: string;
}

declare module 'express' {
  interface Request {
    user?: UserInfo;
  }
}
