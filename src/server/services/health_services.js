import { db } from '../db';
import { NotFoundError } from '../errors/errors';

class HealthService {
  static getHealthServices(filters = {}) {
    const hospitals = Promise.resolve(this.getHospitals(filters));
    const doctors = Promise.resolve(this.getDoctors(filters));
    return Promise.all([hospitals, doctors]).then(res => res[0].concat(res[1]));
  }

  static getHospitals(filters = {}) {
    const { specialization, ...normalFilters } = filters;
    let query = db('hospitals').select('hospitals.id', 'hospitals.minimum_plan', 'hospitals.name', 'hospitals.mail', 'hospitals.telephone', 'hospitals.lat', 'hospitals.lon').distinct()
      .where(normalFilters);
    if (specialization !== undefined) {
      query = query.innerJoin('hospitals_specializations', 'hospitals.id', 'hospitals_specializations.hospital_id')
        .innerJoin('specializations', 'specializations.id', 'hospitals_specializations.specialization_id')
        .where('specializations.name', specialization);
    }
    return query;
  }

  static getDoctors(filters = {}) {
    const { specialization, ...normalFilters } = filters;
    let query = db('doctors').select('doctors.id', 'doctors.minimum_plan', 'doctors.name', 'doctors.mail', 'doctors.telephone', 'doctors.lat', 'doctors.lon').distinct()
      .where(normalFilters);
    if (specialization !== undefined) {
      query = query.innerJoin('doctors_specializations', 'doctors.id', 'doctors_specializations.doctor_id')
        .innerJoin('specializations', 'specializations.id', 'doctors_specializations.specialization_id')
        .where('specializations.name', specialization);
    }
    return query;
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
