import db from '../db';
import HealthServices from './health_services';
import { NotFoundError } from '../errors/errors';
import 'babel-polyfill';

describe('Health Services', () => {
  afterAll(() => {
    db.destroy().then();
  });

  test('returns all health services', async () => {
    const expectedServices = [
      {
        id: 1,
        lat: -33,
        lon: -43.3,
        minimum_plan: 1,
        name: 'Hospital Alemán',
        mail: 'hospital_aleman@gmail.com',
        telephone: 48277000,
        address: 'Pueyrredón 1640',
        zone: 'Parque chas',
        health_center: true
      }, {
        id: 2,
        lat: -37,
        lon: -53.3,
        minimum_plan: 2,
        name: 'Hospital Italiano',
        mail: 'hospital_italiano@gmail.com',
        telephone: 49590300,
        address: 'Tte. Gral. Juan Domingo Perón 4190, C.A.B.A.',
        zone: 'Belgrano',
        health_center: true
      }, {
        id: 1,
        lat: -33,
        lon: -43.3,
        mail: 'jperez@gmail.com',
        minimum_plan: 1,
        name: 'Jorge Perez',
        telephone: 47341234,
        address: 'San Juan 3100, C.A.B.A',
        address_notes: '1 B',
        zone: 'Saavedra',
        health_center: false
      }, {
        id: 2,
        lat: -37,
        lon: -53.3,
        mail: 'crodriguez@gmail.com',
        minimum_plan: 2,
        name: 'Claudia Rodriguez',
        telephone: 528561,
        address: 'Matienzo 345, C.A.B.A',
        address_notes: 'Puerta roja',
        zone: 'Chacarita',
        health_center: false
      }
    ];
    const services = await HealthServices.getHealthServices();
    expect(services).toHaveLength(expectedServices.length);
    expect(services).toEqual(expect.arrayContaining(expectedServices));
    expect(expectedServices).toEqual(expect.arrayContaining(services));
  });

  test('returns all hospitals', async () => {
    const expectedHospitals = [
      {
        id: 1,
        lat: -33,
        lon: -43.3,
        minimum_plan: 1,
        name: 'Hospital Alemán',
        mail: 'hospital_aleman@gmail.com',
        telephone: 48277000,
        address: 'Pueyrredón 1640',
        zone: 'Parque chas'
      }, {
        id: 2,
        lat: -37,
        lon: -53.3,
        minimum_plan: 2,
        name: 'Hospital Italiano',
        mail: 'hospital_italiano@gmail.com',
        telephone: 49590300,
        address: 'Tte. Gral. Juan Domingo Perón 4190, C.A.B.A.',
        zone: 'Belgrano'
      }];
    const hospitals = await HealthServices.getHospitals();
    expect(hospitals).toHaveLength(expectedHospitals.length);
    expect(hospitals).toEqual(expect.arrayContaining(expectedHospitals));
    expect(expectedHospitals).toEqual(expect.arrayContaining(hospitals));
  });

  test('returns hospitals filtered by name', async () => {
    const expectedHospitals = [
      {
        id: 1,
        lat: -33,
        lon: -43.3,
        minimum_plan: 1,
        name: 'Hospital Alemán',
        mail: 'hospital_aleman@gmail.com',
        telephone: 48277000,
        address: 'Pueyrredón 1640',
        zone: 'Parque chas'
      }];
    const hospitals = await HealthServices.getHospitals({ name: 'Hospital Alemán' });
    expect(hospitals).toEqual(expectedHospitals);
  });

  test('returns hospitals filtered by specialization', async () => {
    const expectedHospitals = [
      {
        id: 1,
        lat: -33,
        lon: -43.3,
        minimum_plan: 1,
        name: 'Hospital Alemán',
        mail: 'hospital_aleman@gmail.com',
        telephone: 48277000,
        address: 'Pueyrredón 1640',
        zone: 'Parque chas'
      }];
    const hospitals = await HealthServices.getHospitals({ specialization: 'Dermatologia' });
    expect(hospitals).toEqual(expectedHospitals);
  });

  test('returns all doctors', async () => {
    const expectedDoctors = [
      {
        id: 1,
        lat: -33,
        lon: -43.3,
        mail: 'jperez@gmail.com',
        minimum_plan: 1,
        name: 'Jorge Perez',
        telephone: 47341234,
        address: 'San Juan 3100, C.A.B.A',
        address_notes: '1 B',
        zone: 'Saavedra'
      }, {
        id: 2,
        lat: -37,
        lon: -53.3,
        mail: 'crodriguez@gmail.com',
        minimum_plan: 2,
        name: 'Claudia Rodriguez',
        telephone: 528561,
        address: 'Matienzo 345, C.A.B.A',
        address_notes: 'Puerta roja',
        zone: 'Chacarita'
      }
    ];
    const doctors = await HealthServices.getDoctors();
    expect(doctors).toHaveLength(expectedDoctors.length);
    expect(doctors).toEqual(expect.arrayContaining(expectedDoctors));
    expect(expectedDoctors).toEqual(expect.arrayContaining(doctors));
  });

  test('returns doctors filtered by name', async () => {
    const expectedDoctors = [
      {
        id: 1,
        lat: -33,
        lon: -43.3,
        mail: 'jperez@gmail.com',
        minimum_plan: 1,
        name: 'Jorge Perez',
        telephone: 47341234,
        address: 'San Juan 3100, C.A.B.A',
        address_notes: '1 B',
        zone: 'Saavedra'
      }
    ];
    const doctors = await HealthServices.getDoctors({ name: 'Jorge Perez' });
    expect(doctors).toEqual(expectedDoctors);
  });

  test('returns doctors filtered by specialization', async () => {
    const expectedDoctors = [
      {
        id: 2,
        lat: -37,
        lon: -53.3,
        mail: 'crodriguez@gmail.com',
        minimum_plan: 2,
        name: 'Claudia Rodriguez',
        telephone: 528561,
        address: 'Matienzo 345, C.A.B.A',
        address_notes: 'Puerta roja',
        zone: 'Chacarita'
      }
    ];
    const doctors = await HealthServices.getDoctors({ specialization: 'Odontologia' });
    expect(doctors).toEqual(expectedDoctors);
  });

  test('returns hopsital with selected ID', async () => {
    const expectedHospital = {
      id: 1,
      minimum_plan: 1,
      name: 'Hospital Alemán',
      mail: 'hospital_aleman@gmail.com',
      telephone: 48277000,
      address: 'Pueyrredón 1640',
      lat: -33,
      lon: -43.3,
      zone: 'Parque chas',
      specializations: ['Cardiologia', 'Clinica', 'Dermatologia'],
      languages: ['Español', 'Ingles']
    };
    await expect(HealthServices.getHospitalByID(1)).resolves.toStrictEqual(expectedHospital);
  });

  test('returns error when there is no hospital with provided ID', async () => expect(HealthServices.getHospitalByID(3)).rejects.toThrow(NotFoundError));

  test('returns doctor with selected ID', async () => {
    const expectedDoctor = {
      id: 1,
      minimum_plan: 1,
      name: 'Jorge Perez',
      mail: 'jperez@gmail.com',
      telephone: 47341234,
      address: 'San Juan 3100, C.A.B.A',
      address_notes: '1 B',
      lat: -33,
      lon: -43.3,
      zone: 'Saavedra',
      languages: ['Español'],
      specializations: ['Cardiologia', 'Clinica']
    };
    await expect(HealthServices.getDoctorByID(1)).resolves.toStrictEqual(expectedDoctor);
  });

  test('returns error when there is no doctor with provided ID', async () => expect(HealthServices.getDoctorByID(3)).rejects.toThrow(NotFoundError));

  test('creates a new doctor', async () => {
    const newDoctor = {
      minimum_plan: 2,
      name: 'Stephen Strange',
      mail: 'sstrange@gmail.com',
      telephone: 55547862,
      address: 'Av. Rivadavia 1460',
      address_notes: '2 A',
      lat: -32,
      lon: -41,
      zone: 'Palermo'
    };
    const createdDoctor = await HealthServices.createDoctor(
      newDoctor.name,
      newDoctor.telephone,
      newDoctor.minimum_plan,
      newDoctor.mail,
      newDoctor.lat,
      newDoctor.lon,
      newDoctor.address,
      newDoctor.address_notes,
      newDoctor.zone
    );
    delete createdDoctor.id;
    expect(newDoctor).toStrictEqual(createdDoctor);
  });

  test('creates new hospital', async () => {
    const newHospital = {
      minimum_plan: 1,
      name: 'Hospital Central',
      mail: 'hospital_central@gmail.com',
      telephone: 48277992,
      address: 'Cerrito 132',
      lat: -33.4,
      lon: -43.7,
      zone: 'Liniers'
    };
    const createdHospital = await HealthServices.createHospital(
      newHospital.name,
      newHospital.telephone,
      newHospital.minimum_plan,
      newHospital.mail,
      newHospital.lat,
      newHospital.lon,
      newHospital.address,
      newHospital.zone
    );
    delete createdHospital.id;
    expect(newHospital).toStrictEqual(createdHospital);
  });
});
