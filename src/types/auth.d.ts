import { User } from '../models/Users' // export interface User { _id: string, ... }
import 'express-session';

declare module 'passport' {
  interface Authenticator {
    serializeUser<TID>(fn: (user: User, done: (err: any, id?: TID) => void) => void): void;
  }
}


declare module 'express-session' {
  interface Session {
    passport: { user: string };
  }
}