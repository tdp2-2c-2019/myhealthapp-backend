import { db } from '../db';
import { UserNotFoundError, ValidationError } from '../errors/errors';
import CryptoService from '../utils/crypto';

class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
      // TODO: Use bcrypt to store passwords and retrieve them
      const hashedPassword = CryptoService.encrypt(password);
      db('users').where('dni', dni).update({
        password: hashedPassword,
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
    db.select().from('users').where(dni)
      .then((rows) => {
        if (rows.length === 0) {
          throw new UserNotFoundError('User not found');
        } else {
          console.log(rows[0]);
          const passwordsMatch = CryptoService.compare(password, rows[0].password);
          if (!passwordsMatch) {
            throw new ValidationError('Incorrect DNI or password.');
          } else {
            return rows[0];
          }
        }
      });
  }
}

export default UserService;
