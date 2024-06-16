import { User } from '../models/Users' // export interface User { _id: string, ... }

declare module 'passport' {
  interface Authenticator {
    serializeUser<TID>(fn: (user: User, done: (err: any, id?: TID) => void) => void): void;
  }
}