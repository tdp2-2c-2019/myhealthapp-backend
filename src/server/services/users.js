import { db } from '../db';

export class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.statusCode = 404;
  }
}

export class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
      db('users').where('dni', dni).update({
        password,
        mail
      }).returning('dni')
        .then((res) => {
          if (res.length === 0) {
            reject(new UserNotFoundError('User with this DNI does not exist'));
          } else {
            resolve('ok');
          }
        });
    });
  }
}
