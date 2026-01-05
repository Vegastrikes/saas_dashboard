import jwt, { type Secret } from "jsonwebtoken";
import type { AccessTokenPayload } from "../types/auth";

const secret: Secret = process.env.JWT_SECRET ?? (() => {
  throw new Error("JWT_SECRET is required");
})();

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, secret) as AccessTokenPayload;
}
