import { db } from '../db';
import { NotFoundError, AuthorizationError, ResourceAlreadyExistsError } from '../errors/errors';
import CryptoService from '../utils/crypto';

class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
      CryptoService.encrypt(password).then((hashedPassword) => {
        db.select().from('users').where('dni', dni).then((rows) => {
          if (rows.length > 0 && rows[0].password !== null) {
            reject(new ResourceAlreadyExistsError('User with this DNI already exists'));
          } else {
            db('users').where('dni', dni).update({
              password: hashedPassword,
              mail
            })
              .returning('dni')
              .then((res) => {
                if (res.length === 0) {
                  reject(new NotFoundError('User with this DNI does not exist'));
                } else {
                  resolve();
                }
              });
          }
        })
          .catch(e => console.error(e));
      });
    });
  }

  static checkCredentials(dni, password) {
    return new Promise((resolve, reject) => {
      db('users').where('dni', dni)
        .then((rows) => {
          if (rows.length === 0) {
            // For security reasons we don't inform that the user was not found.
            reject(new AuthorizationError('Incorrect DNI or password.'));
          } else {
            CryptoService.compare(password, rows[0].password).then((passwordsMatch) => {
              if (!passwordsMatch) {
                reject(new AuthorizationError('Incorrect DNI or password.'));
              } else if (rows[0].blocked) {
                reject(new AuthorizationError('Your user is blocked, please contact helpdesk'));
              } else {
                resolve();
              }
            });
          }
        });
    });
  }
}

export default UserService;
