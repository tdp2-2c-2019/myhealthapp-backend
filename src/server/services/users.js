import { db } from '../db';
import { NotFoundError, AuthorizationError, ResourceAlreadyExistsError } from '../errors/errors';
import CryptoService from '../utils/crypto';

class UserService {
  static createUser(dni, password, mail) {
    return new Promise((resolve, reject) => {
      CryptoService.encrypt(password).then((hashedPassword) => {
        db.select().from('users').where('dni', dni).then((rows) => {
          if (rows.length > 0 && rows[0].password !== null) {
            reject(new ResourceAlreadyExistsError('El usuario con este DNI ya existe'));
          } else {
            db('users').where('dni', dni).update({
              password: hashedPassword,
              mail
            })
              .returning('dni')
              .then((res) => {
                if (res.length === 0) {
                  reject(new NotFoundError('El usuario con este DNI no existe'));
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
            reject(new AuthorizationError('DNI o contraseña incorrextos'));
          } else {
            CryptoService.compare(password, rows[0].password).then((passwordsMatch) => {
              if (!passwordsMatch) {
                reject(new AuthorizationError('DNI o contraseña incorrextos'));
              } else if (rows[0].blocked) {
                reject(new AuthorizationError('Su usuario esta bloqueado, contacte a mesa de ayuda'));
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
