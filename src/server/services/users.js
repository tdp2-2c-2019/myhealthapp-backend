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
          if (rows[0].blocked) reject(new AuthorizationError('Su usuario esta bloqueado, contacte a mesa de ayuda'));
          else resolve(rows[0]);
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
          if (rows[0].blocked) reject(new AuthorizationError('Su usuario esta bloqueado, contacte a mesa de ayuda'));
          else resolve(rows[0]);
        } else {
          reject(new NotFoundError('Usuario no encontrado'));
        }
      });
    });
  }

  static getUserByDNI(dni) {
    return new Promise((resolve, reject) => {
      db.select().from('users').where({ dni }).then((rows) => {
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

  static getUserFamilyGroup(dni) {
    return new Promise((resolve, reject) => {
      db.select('affiliate_id').from('users').where('dni', dni)
        .then((users) => {
          if (users.length === 0) reject(new NotFoundError('Afiliado no encontrado'));
          else {
            db.select('dni', 'affiliate_id', 'first_name', 'last_name').from('users').where('affiliate_id', 'like', `${users[0].affiliate_id.slice(0, 8)}__`)
              .then(resolve);
          }
        })
        .catch(err => reject(new Error(`Ocurrió un error al obtener el grupo familiar del afiliado: ${err}`)));
    });
  }

  static getSummarizedInfo() {
    return new Promise((resolve, reject) => {
      db.select('plan', db.raw('COUNT(plan) AS count')).from('users').groupBy('plan')
        .then(resolve)
        .catch(err => reject(new Error(`Ocurrió un error al obtener los datos sumarizados de usuarios: ${err}`)));
    });
  }
}

export default UserService;
