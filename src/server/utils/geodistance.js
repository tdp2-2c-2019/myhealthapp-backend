const deg2rad = deg => deg * (Math.PI / 180);
const calculateDistance = (origin, destination) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(destination.lat - origin.lat);
  const dLon = deg2rad(destination.lon - origin.lon);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(deg2rad(origin.lat))
        * Math.cos(deg2rad(destination.lat))
        * Math.sin(dLon / 2)
        * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export default calculateDistance;
