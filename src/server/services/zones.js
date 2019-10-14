import { db } from '../db';

class ZoneService {
  static getZones() {
    return new Promise((resolve, reject) => {
      db.select('zone').from('doctors').union(() => { db.select('zone').from('hospitals'); })
        .then(rows => resolve(rows))
        .catch(() => reject(new Error('Ocurrió un error al obtener las zonas')));
    });
  }
}

export default ZoneService;
