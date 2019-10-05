import { db } from '../db';

class SpecializationService {
  static getSpecializations() {
    return new Promise((resolve, reject) => {
      db.select().from('specializations')
        .then(rows => resolve(rows))
        .catch(() => reject(new Error('Ocurrió un error al obtener las especializaciones')));
    });
  }
}

export default SpecializationService;
