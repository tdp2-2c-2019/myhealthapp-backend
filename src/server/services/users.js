import { db } from '../db';
import { UserNotFoundError } from '../errors/errors';

class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
      // TODO: Use bcrypt to store passwords and retrieve them
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

  static getUserByDniAndPassword(dni, password) {
    // TODO: Use bcrypt to store passwords and retrieve them
    db.select().from('users').where({ dni, password })
      .then((rows) => {
        if (rows.length === 0) {
          throw new UserNotFoundError('User not found');
        } else {
          return rows[0];
        }
      });
  }
}

export default UserService;
