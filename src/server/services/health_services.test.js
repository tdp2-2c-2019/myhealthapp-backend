import db from '../db';
import HealthServices from './health_services';
import { NotFoundError } from '../errors/errors';

describe('Health Services', () => {
  afterAll(() => {
    db.destroy().then();
  });

  test('returns all health services', () => {
    const expectedServices = [
      {
        id: 1, lat: -33, lon: -43.3, minimum_plan: 1, name: 'hospital1'
      }, {
        id: 2, lat: -37, lon: -53.3, minimum_plan: 2, name: 'hospital2'
      }, {
        id: 1, lat: -33, lon: -43.3, mail: 'jperez@gmail.com', minimum_plan: 1, name: 'Jorge Perez'
      }, {
        id: 2, lat: -37, lon: -53.3, mail: 'crodriguez@gmail.com', minimum_plan: 2, name: 'Claudia Rodriguez'
      }
    ];
    return expect(HealthServices.getHealthServices()).resolves.toStrictEqual(expectedServices);
  });

  test('returns all hospitals', () => {
    const expectedHospitals = [
      {
        id: 1, lat: -33, lon: -43.3, minimum_plan: 1, name: 'hospital1'
      }, {
        id: 2, lat: -37, lon: -53.3, minimum_plan: 2, name: 'hospital2'
      }];
    return expect(HealthServices.getHospitals()).resolves.toStrictEqual(expectedHospitals);
  });

  test('returns all doctors', () => {
    const expectedDoctors = [
      {
        id: 1, lat: -33, lon: -43.3, mail: 'jperez@gmail.com', minimum_plan: 1, name: 'Jorge Perez'
      }, {
        id: 2, lat: -37, lon: -53.3, mail: 'crodriguez@gmail.com', minimum_plan: 2, name: 'Claudia Rodriguez'
      }
    ];
    return expect(HealthServices.getDoctors()).resolves.toStrictEqual(expectedDoctors);
  });

  test('returns hopsital with selected ID', () => {
    const expectedHospital = {
      id: 1,
      minimum_plan: 1,
      name: 'hospital1',
      lat: -33,
      lon: -43.3
    };
    return expect(HealthServices.getHospitalByID(1)).resolves.toStrictEqual(expectedHospital);
  });

  test('returns error when there is no hospital with provided ID', () => expect(HealthServices.getHospitalByID(3)).rejects.toThrow(NotFoundError));

  test('returns doctor with selected ID', () => {
    const expectedDoctor = {
      id: 1,
      minimum_plan: 1,
      name: 'Jorge Perez',
      mail: 'jperez@gmail.com',
      lat: -33,
      lon: -43.3
    };
    return expect(HealthServices.getDoctorByID(1)).resolves.toStrictEqual(expectedDoctor);
  });

  test('returns error when there is no doctor with provided ID', () => expect(HealthServices.getDoctorByID(3)).rejects.toThrow(NotFoundError));
});
