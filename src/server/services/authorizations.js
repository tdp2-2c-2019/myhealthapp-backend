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
        .orderBy('id')
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

  static putAuthorizationByID(id, data) {
    return new Promise((resolve, reject) => {
      db('authorizations')
        .where('id', id)
        .update({ status: data.status, note: data.note, updated_at: new Date() }, ['*'])
        .then(async (auth) => {
          if (auth.length === 0) reject(new NotFoundError('Autorización no encontrada'));
          else {
            this.saveAuthorizationChangeOnHistory(id, data.note, data.status)
              .then(resolve(this.getAuthorizationByID(id)))
              .catch(reject(new Error('Ocurrió un error al actualizar la autorización')));
          }
        })
        .catch(() => reject(new Error('Ocurrió un error al actualizar la autorización')));
    });
  }

  static createAuthorization(createdBy, createdFor, title) {
    return new Promise((resolve, reject) => {
      db('authorizations').insert({
        created_by: createdBy,
        created_for: createdFor,
        status: 'PENDIENTE',
        title
      })
        .returning('*')
        .then((rows) => {
          const authorization = rows[0];
          this.saveAuthorizationChangeOnHistory(authorization.id, '', authorization.status)
            .then(resolve(authorization))
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });
  }

  static saveAuthorizationChangeOnHistory(id, note, status) {
    return new Promise((resolve, reject) => {
      db('authorizations_history').insert({
        authorization_id: id,
        note,
        status
      }).then(resolve())
        .catch(e => reject(e));
    });
  }

  static getAuthorizationHistoryByID(id) {
    return new Promise((resolve, reject) => {
      db.select().from('authorizations_history')
        .where('authorization_id', id)
        .then((rows) => {
          if (rows.length == 0) reject(new NotFoundError('Autorización no encontrada'));
          else resolve(rows);
        })
        .catch(() => reject(new Error('Ocurrió un error al obtener el historial para la autorización')));
    });
  }
}

export default AuthorizationService;
