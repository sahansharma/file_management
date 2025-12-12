import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = (process.env.JWT_SECRET as Secret) || "change_this_secret";

export const signToken = (payload: object, expiresIn: string | number = "1h") => {
  const opts: SignOptions = { expiresIn } as SignOptions;
  return jwt.sign(payload as any, JWT_SECRET, opts);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as any;
};
//helper function :jwt.ts -> generating and verifying JWT tokens
