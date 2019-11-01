import { db } from '../db';
import { NotFoundError } from '../errors/errors';
import UserService from './users';

class AuthorizationService {
  static getAuthorizations(dni) {
    return new Promise((resolve, reject) => {
      db.select().from('authorizations')
        .modify((queryBuilder) => {
          if (dni) {
            queryBuilder.where('created_by', dni).orWhere('created_for', dni);
          }
        })
        .then(async (rows) => {
          resolve(await Promise.all(rows.map(async (authorization) => {
            const createdBy = UserService.getUserByDNI(authorization.created_by);
            const createdFor = UserService.getUserByDNI(authorization.created_for);
            const values = await Promise.all([createdBy, createdFor]);
            return ({ ...authorization, created_by: values[0], created_for: values[1] });
          })));
        })
        .catch(() => {
          reject(new Error('Ocurrió un error al obtener las autorizaciones'));
        });
    });
  }

  static getAuthorizationByID(id) {
    return new Promise((resolve, reject) => {
      db.select().from('authorizations')
        .where('id', id)
        .then(async (auth) => {
          if (auth.length === 0) reject(new NotFoundError('Autorización no encontrada'));
          const authorization = auth[0];
          const createdBy = UserService.getUserByDNI(authorization.created_by);
          const createdFor = UserService.getUserByDNI(authorization.created_for);
          const values = await Promise.all([createdBy, createdFor]);
          resolve({ ...authorization, created_by: values[0], created_for: values[1] });
        })
        .catch(() => reject(new Error('Ocurrió un error al obtener la autorización')));
    });
  }

  static createAuthorization(created_by, created_for, title) {
    // FIXME created_at has the wrong date
    return new Promise((resolve, reject) => {
      db('authorizations').insert({
        created_by,
        created_for,
        status: 'PENDIENTE',
        title
      })
        .returning('*')
        .then(rows => resolve(rows))
        .catch(e => reject(e));
    });
  }
}

export default AuthorizationService;
