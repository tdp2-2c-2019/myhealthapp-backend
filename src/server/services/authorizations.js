import { db } from '../db';
import { NotFoundError } from '../errors/errors';
import UserService from './users';

const getPast30Days = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const now = new Date();
  const past30days = [];
  for (let d = date; d <= now; d.setDate(d.getDate() + 1)) {
    const b = new Date(d);
    b.setHours(0, 0, 0, 0);
    past30days.push(b);
  }
  return past30days;
};

class AuthorizationService {
  static getAuthorizations(dni) {
    return new Promise((resolve, reject) => {
      db.select(['id', 'type', 'created_for', 'created_by', 'created_at', 'status', 'title', 'note', 'updated_at', 'approved_by']).from('authorizations')
        .modify((queryBuilder) => {
          if (dni) {
            queryBuilder.where('created_by', dni).orWhere('created_for', dni);
          }
        })
        .orderBy('updated_at', 'desc')
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
      db.select(['id', 'type', 'created_for', 'created_by', 'created_at', 'status', 'title', 'note', 'updated_at', 'approved_by']).from('authorizations')
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

  static getAuthorizationPhotoByID(id) {
    return new Promise((resolve, reject) => {
      db.select('photo').where('id', id).from('authorizations')
        .then((rows) => {
          if (rows.length === 0) reject(new NotFoundError('Autorización no encontrada'));
          else if (!rows[0].photo) reject(new NotFoundError('Foto de la autorización no encontrada'));
          const photo = rows[0];
          resolve(Buffer.from(photo.photo, 'base64'));
        })
        .catch(() => reject(new Error('Ocurrió un error al obtener la foto de la autorización')));
    });
  }

  static putAuthorizationByID(id, data) {
    return new Promise((resolve, reject) => {
      db('authorizations')
        .where('id', id)
        .update({ status: data.status, note: data.note, updated_at: new Date() }, ['id'])
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

  static createAuthorization(createdBy, createdFor, title, type, photo) {
    return new Promise(async (resolve, reject) => {
      const destUser = await UserService.getUserByDNI(createdFor);
      const authType = await AuthorizationService.getTypeByID(type);
      let auth = {
        created_by: createdBy,
        created_for: createdFor,
        status: 'PENDIENTE',
        title,
        type,
        photo
      };
      if (authType.minimum_plan <= destUser.plan) {
        auth = {
          ...auth,
          status: 'APROBADO',
          approved_by: 'SYSTEM',
          note: 'Aprobado automáticamente por sistema'
        };
      }
      db('authorizations').insert(auth)
        .returning(['id', 'type', 'created_for', 'created_by', 'created_at', 'status', 'title', 'note', 'updated_at', 'approved_by'])
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
          if (rows.length === 0) reject(new NotFoundError('Autorización no encontrada'));
          else resolve(rows);
        })
        .catch(() => reject(new Error('Ocurrió un error al obtener el historial para la autorización')));
    });
  }

  static getTypes() {
    return new Promise((resolve, reject) => {
      db.select().from('authorizations_types')
        .then(rows => resolve(rows))
        .catch(() => reject(new Error('Ocurrió un error al obtener los tipos de autorizaciones')));
    });
  }

  static getTypeByID(id) {
    return new Promise((resolve, reject) => {
      db('authorizations_types').select().where('id', id)
        .then((rows) => {
          if (rows.length === 0) reject(new NotFoundError('Tipo de autorización no encontrada'));
          else resolve(rows[0]);
        })
        .catch(e => reject(e));
    });
  }

  static createType(title, minimumPlan) {
    return new Promise((resolve, reject) => {
      db('authorizations_types').insert({
        title,
        minimum_plan: minimumPlan
      }).then(resolve())
        .catch(e => reject(e));
    });
  }

  static getSummarizedInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        const authorizedCountPerDay = (await db.raw("select count(*) as status_count, date_trunc('day', updated_at) as date from authorizations where updated_at >= NOW() - interval '30 days' and status = 'APROBADO' group by date order by date")).rows;
        const rejectedCountPerDay = (await db.raw("select count(*) as status_count, date_trunc('day', updated_at) as date from authorizations where updated_at >= NOW() - interval '30 days' and status = 'RECHAZADO' group by date order by date")).rows;
        const automaticApprovedCount = (await db.raw("select count(*) from authorizations where updated_at >= NOW() - interval '30 days' and approved_by = 'SYSTEM'")).rows[0].count;
        const manualApprovedCount = (await db.raw("select count(*) from authorizations where updated_at >= NOW() - interval '30 days' and approved_by = 'MANUAL'")).rows[0].count;

        const past30days = getPast30Days();

        const authorizedCountForAllLast30Days = past30days.map((day) => {
          const existingAuthorizedCountForDay = authorizedCountPerDay.find(acpd => acpd.date.toISOString() === day.toISOString());
          return existingAuthorizedCountForDay || { status_count: '0', date: day };
        });

        const rejectedCountForAllLast30Days = past30days.map((day) => {
          const existingRejectedCountForDay = rejectedCountPerDay.find(rcpd => rcpd.date.toISOString() === day.toISOString());
          return existingRejectedCountForDay || { status_count: '0', date: day };
        });

        resolve({
          authorized_count_per_day: authorizedCountForAllLast30Days,
          rejected_count_per_day: rejectedCountForAllLast30Days,
          automatic_approved_count: automaticApprovedCount,
          manual_approved_count: manualApprovedCount
        });
      } catch (err) {
        reject(new Error('Ocurrió un error al obtener los datos sumarizados para autorizaciones'));
      }
    });
  }
}

export default AuthorizationService;
