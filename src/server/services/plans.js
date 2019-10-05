import { db } from '../db';

class PlanService {
  static getPlans() {
    return new Promise((resolve, reject) => {
      db.select().from('plans')
        .then(rows => resolve(rows))
        .catch(() => reject(new Error('Ocurrió un error al obtener los planes')));
    });
  }
}

export default PlanService;
