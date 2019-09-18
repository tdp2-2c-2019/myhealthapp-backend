import { db } from '../db';
import { UserNotFoundError } from '../errors/errors';

class UserService {
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
            resolve();
          }
        });
    });
  }
}

export default UserService;
