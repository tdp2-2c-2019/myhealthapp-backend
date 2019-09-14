import { query } from '../db';

export class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.statusCode = 404;
  }
}

export class UserService {
  static createUser(dni, password, mail) {
    try {
      query('select * from users where dni = $1', [dni], (err, result) => {
        if (err) {
          throw err;
        }
        if (result.rowCount === 0) {
          throw new UserNotFoundError('User with this DNI does not exist');
        } else if (result.rowCount === 1) {
          query('update users set password = $1, mail = $2 where dni = $3', [password, mail, dni], (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    } catch (error) {
      console.log('ctched');
    }
  }
}
