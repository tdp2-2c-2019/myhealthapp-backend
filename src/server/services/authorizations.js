import { db } from '../db';
import { NotFoundError } from '../errors/errors';

class AuthorizationService {
  static getAuthorizations(dni) {
    return new Promise((resolve, reject) => {
      db.select().from('authorizations')
        .modify((queryBuilder) => {
          if (dni) {
            queryBuilder.where('created_by', dni).orWhere('created_for', dni);
          }
        })
        .then(rows => resolve(rows))
        .catch(() => reject(new Error('Ocurrió un error al obtener las autorizaciones')));
    });
  }

  static getAuthorizationByID(id) {
    return new Promise((resolve, reject) => {
      db.select().from('authorizations')
        .where('id', id)
        .then((auth) => {
          if (auth.length === 0) reject(new NotFoundError('Authorization not found'));
          resolve(auth[0]);
        })
        .catch(() => reject(new Error('Ocurrió un error al obtener la autorización')));
    });
  }
}

export default AuthorizationService;
