import calculateDistance from './geodistance';

describe('Geodistance', () => {
  test('should return distance equal to zero when origin and distance are the same point', () => {
    const origin = { lat: -37, lon: -43.3 };
    const destination = origin;
    const expectedDistance = 0;
    expect(calculateDistance(origin, destination)).toBe(expectedDistance);
  });

  test('should return distance between two different points', () => {
    const origin = { lat: -37, lon: -43.3 };
    // TODO change destination and expectedDistance
    const destination = { lat: -37, lon: -43.3 };
    const expectedDistance = 0;
    expect(calculateDistance(origin, destination)).toBe(expectedDistance);
  });
});
