import { db } from '../db';
import { UserNotFoundError, ValidationError } from '../errors/errors';
import CryptoService from '../utils/crypto';

class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
      db('users').where('dni', dni)
        .then((rows) => {
          if (rows.length === 0) {
            reject(new UserNotFoundError('User not found'));
          } else {
            const passwordsMatch = CryptoService.compare(password, rows[0].password);
            if (!passwordsMatch) {
              reject(new ValidationError('Incorrect DNI or password.'));
            } else {
              resolve(rows[0]);
            }
          }
        });
    });
  }
}

export default UserService;
