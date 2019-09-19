import { verify, sign } from 'jsonwebtoken';
import { ValidationError } from '../errors/errors';
import UserService from '../services/users';

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
  static login(req, res, next) {
    const { dni, password } = req.body;

    if (!dni || !password) {
      throw new ValidationError('Missing DNI and/or password');
    }
    UserService.checkCredentials(dni, password)
      .then(() => {
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
      })
      .catch(e => next(e));
  }
}
