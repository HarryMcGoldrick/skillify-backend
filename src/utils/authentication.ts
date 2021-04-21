// Dont run test coverage for Utils
/* istanbul ignore file */
import { sign, verify } from 'jsonwebtoken';

// Create a JWT token using the secret in the .env config
export const generateJWT = (userId: string, username: string) => {
  // Token expires in 6 hours
  const exp = Math.floor(Date.now() / 1000) + (60 * 60) * 6;
  return sign({ userId, username, exp, }, process.env.TOKEN_SECRET);
}

// Check the request header and authenticate the token attached
export const authenticateToken = (req, res, next) => {

  if (process.env.NODE_ENV === 'test') {
    next();
    return;
  }

  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    // tslint:disable-next-line: no-console
    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}