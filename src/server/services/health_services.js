import { db } from '../db';
import { NotFoundError } from '../errors/errors';

class HealthService {
  static getHealthServices() {
    const hospitals = Promise.resolve(db('hospitals').select());
    const doctors = Promise.resolve(db('doctors').select('id', 'minimum_plan', 'name', 'lat', 'lon'));
    return Promise.all([hospitals, doctors]).then(res => res[0].concat(res[1]));
  }

  static getHospitals() {
    return db('hospitals').select();
  }

  static getDoctors() {
    return db('doctors').select('id', 'minimum_plan', 'name', 'lat', 'lon');
  }

  static getHospitalByID(id) {
    return new Promise((resolve, reject) => {
      db('hospitals').where('id', id).then((hospital) => {
        if (hospital.length === 0) reject(new NotFoundError('Hospital not found'));
        else resolve(hospital[0]);
      });
    });
  }

  static getDoctorByID(id) {
    return new Promise((resolve, reject) => {
      db('doctors').where('id', id).then((doctor) => {
        if (doctor.length === 0) reject(new NotFoundError('Doctor not found'));
        else resolve(doctor[0]);
      });
    });
  }
}

export default HealthService;
