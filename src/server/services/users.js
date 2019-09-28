import { db } from '../db';
import { NotFoundError, AuthorizationError, ResourceAlreadyExistsError } from '../errors/errors';
import CryptoService from '../utils/crypto';

class UserService {
  static updateUser(user) {
    return new Promise((resolve, reject) => {
      db('users').where({ dni: user.dni }).update({ ...user })
        .then(resolve())
        .catch(() => reject(new Error('Ocurrió un error al actualizar el usuario')));
    });
  }

  static getUserByToken(token) {
    return new Promise((resolve, reject) => {
      db.select().from('users').where({ token }).then((rows) => {
        if (rows.length > 0) {
          resolve(rows[0]);
        } else {
          reject(new NotFoundError('Token invalido'));
        }
      });
    });
  }

  static getUserByMail(mail) {
    return new Promise((resolve, reject) => {
      db.select().from('users').where({ mail }).then((rows) => {
        if (rows.length > 0) {
          resolve(rows[0]);
        } else {
          reject(new NotFoundError('Usuario no encontrado'));
        }
      });
    });
  }

  static createUser(dni, password, mail, firstName, lastName, plan) {
    return new Promise((resolve, reject) => {
      CryptoService.encrypt(password).then((hashedPassword) => {
        db.select().from('users').where({ dni, plan }).then((rows) => {
          console.log(rows[0]);
          if (rows.length > 0) {
            if (rows[0].password !== null) reject(new ResourceAlreadyExistsError('El usuario con este DNI ya existe'));
            if (rows[0].blocked) reject(new AuthorizationError('Su usuario esta bloqueado, contacte a mesa de ayuda'));
            else {
              db('users').where({ dni, plan }).update({
                password: hashedPassword,
                mail,
                first_name: firstName,
                last_name: lastName
              }).then(resolve());
            }
          } else {
            reject(new NotFoundError('El usuario con este DNI o plan no existe'));
          }
        })
          .catch(e => reject(e));
      });
    });
  }

  static checkCredentials(dni, password) {
    return new Promise((resolve, reject) => {
      db('users').where('dni', dni).whereNotNull('password')
        .then((rows) => {
          if (rows.length === 0) {
            // For security reasons we don't inform that the user was not found.
            reject(new AuthorizationError('DNI o contraseña incorrectos'));
          } else {
            CryptoService.compare(password, rows[0].password).then((passwordsMatch) => {
              if (!passwordsMatch) {
                reject(new AuthorizationError('DNI o contraseña incorrectos'));
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
