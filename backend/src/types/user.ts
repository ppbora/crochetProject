import type { JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      id?: string | Types.ObjectId; 
      username?: string; 
      refreshToken?: string
    }
  }
}

declare module "jsonwebtoken" {
    export interface MyTokenPayload extends JwtPayload {
        id: string;
        username: string;
    }
}
