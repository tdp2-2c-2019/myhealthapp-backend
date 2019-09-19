import { db } from '../db';
import { UserNotFoundError, ValidationError } from '../errors/errors';
import CryptoService from '../utils/crypto';

class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
      CryptoService.encrypt(password).then((hashedPassword) => {
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
    });
  }

  static getUserByDniAndPassword(dni, password) {
    return new Promise((resolve, reject) => {
      db('users').where('dni', dni)
        .then((rows) => {
          if (rows.length === 0) {
            reject(new UserNotFoundError('User not found'));
          } else {
            CryptoService.compare(password, rows[0].password).then((passwordsMatch) => {
              if (!passwordsMatch) {
                reject(new ValidationError('Incorrect DNI or password.'));
              } else {
                const user = { ...rows[0], password };
                resolve(user);
              }
            });
          }
        });
    });
  }
}

export default UserService;
