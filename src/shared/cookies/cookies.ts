export type CookieOptions = {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  domain?: string,
  secure?: boolean,
  sameSite?: string,
};
