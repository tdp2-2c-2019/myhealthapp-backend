import { db } from '../db';

class HealthService {
  static getHealthServices() {
    const hospitals = Promise.resolve(db('hospitals').select('id', 'minimum_plan', 'name', 'lat', 'lon'));
    const doctors = Promise.resolve(db('doctors').select('id', 'minimum_plan', 'name', 'lat', 'lon'));
    return Promise.all([hospitals, doctors]).then(res => res[0].concat(res[1]));
  }
}

export default HealthService;
