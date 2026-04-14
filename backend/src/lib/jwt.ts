import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload {
  sub: string;       // user UUID
  username: string;
  role: string;
  manual_type: string | null;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  } as jwt.SignOptions);
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    algorithm: "HS256",
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  }) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  }) as RefreshTokenPayload;
}
