import { verify, sign } from 'jsonwebtoken';
import { ValidationError } from '../errors/errors';

export const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Token is not valid'
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(400).json({
      error: 'Auth token is not supplied'
    });
  }
};

export class HandlerGenerator {
  static login(req, res) {
    const { username: dni } = req.body;
    const { password } = req.body;

    if (!dni || !password) {
      throw new ValidationError('Missing DNI and/or password');
    }
    // TODO: Go and fetch from DB
    const mockedUsername = 'admin';
    const mockedPassword = 'password';

    if (dni && password) {
      if (dni === mockedUsername && password === mockedPassword) {
        const token = sign({ username: dni },
          process.env.JWTSECRET,
          {
            expiresIn: '24h' // expires in 24 hours
          });
        // return the JWT token for the future API calls
        res.json({
          message: 'Authentication successful!',
          token
        });
      } else {
        res.status(403).json({
          error: 'Incorrect username or password'
        });
      }
    } else {
      res.status(400).json({
        error: 'Authentication failed! Please check the request'
      });
    }
  }
}
