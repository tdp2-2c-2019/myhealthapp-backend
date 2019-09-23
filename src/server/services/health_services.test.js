import db from '../db';
import HealthServices from './health_services';

describe('Health Services', () => {
  afterAll(() => {
    db.destroy().then();
  });

  test('return all health services', () => {
    const expectedServices = [
      {
        id: 1, lat: -33, lon: -43.3, minimum_plan: 1, name: 'hospital1'
      }, {
        id: 2, lat: -37, lon: -53.3, minimum_plan: 2, name: 'hospital2'
      }, {
        id: 1, lat: -33, lon: -43.3, minimum_plan: 1, name: 'Jorge Perez'
      }, {
        id: 2, lat: -37, lon: -53.3, minimum_plan: 2, name: 'Claudia Rodriguez'
      }
    ];
    return expect(HealthServices.getHealthServices()).resolves.toStrictEqual(expectedServices);
  });
});
