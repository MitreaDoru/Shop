import { Request } from "express";

export interface GoogleLoginRequest extends Request {
  body: {
    token: string;
  };
  googleProfile?: {
    email: string;
    name: string;
    googleId: string;
  };
}
