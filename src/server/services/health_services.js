import { db } from '../db';
import { NotFoundError } from '../errors/errors';

class HealthService {
  static getHealthServices(filters = {}) {
    const hospitals = Promise.resolve(this.getHospitals(filters));
    const doctors = Promise.resolve(this.getDoctors(filters));
    return Promise.all([hospitals, doctors]).then((res) => {
      const hs = res[0].map(h => ({ ...h, health_center: true }));
      const ds = res[1].map(d => ({ ...d, health_center: false }));
      return hs.concat(ds);
    });
  }

  static createHospital(name, telephone, minimum_plan, mail, lat, lon, address, zone) {
    return new Promise((resolve, reject) => {
      db('hospitals').insert({
        name, telephone, minimum_plan, mail, lat, lon, address, zone
      }).returning('*')
        .then(rows => resolve(rows[0]))
        .catch(e => reject(e));
    });
  }

  static createDoctor(name, telephone, minimum_plan, mail, lat, lon, address, address_notes, zone) {
    return new Promise((resolve, reject) => {
      db('doctors').insert({
        name, telephone, minimum_plan, mail, lat, lon, address, address_notes, zone
      }).returning('*')
        .then(rows => resolve(rows[0]))
        .catch(e => reject(e));
    });
  }

  static getHospitals(filters = {}) {
    const { specialization, name, ...normalFilters } = filters;
    let query = db('hospitals').select(
      'hospitals.id',
      'hospitals.minimum_plan',
      'hospitals.name',
      'hospitals.mail',
      'hospitals.telephone',
      'hospitals.address',
      'hospitals.lat',
      'hospitals.lon',
      'hospitals.zone'
    ).distinct()
      .where(name ? { 'hospitals.name': name, ...normalFilters } : { ...normalFilters });
    if (specialization !== undefined) {
      query = query.innerJoin('hospitals_specializations', 'hospitals.id', 'hospitals_specializations.hospital_id')
        .innerJoin('specializations', 'specializations.id', 'hospitals_specializations.specialization_id')
        .where('specializations.name', specialization);
    }
    return query;
  }

  static getDoctors(filters = {}) {
    const { specialization, name, ...normalFilters } = filters;
    let query = db('doctors').select(
      'doctors.id',
      'doctors.minimum_plan',
      'doctors.name',
      'doctors.mail',
      'doctors.telephone',
      'doctors.address',
      'doctors.address_notes',
      'doctors.lat',
      'doctors.lon',
      'doctors.zone'
    ).distinct()
      .where(name ? { 'doctors.name': name, ...normalFilters } : { ...normalFilters });
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
      db('doctors')
        .select('doctors.*', db.raw('array_agg(distinct specializations.name) as specializations'), db.raw('array_agg(distinct languages.name) as languages'))
        .innerJoin('doctors_specializations', 'doctors.id', 'doctors_specializations.doctor_id')
        .innerJoin('specializations', 'doctors_specializations.specialization_id', 'specializations.id')
        .innerJoin('doctors_languages', 'doctors.id', 'doctors_languages.doctor_id')
        .innerJoin('languages', 'doctors_languages.language_id', 'languages.id')
        .where('doctors.id', id)
        .groupBy('doctors.id')
        .then((doctor) => {
          if (doctor.length === 0) reject(new NotFoundError('Doctor not found'));
          else resolve(doctor[0]);
        });
    });
  }
}

export default HealthService;
