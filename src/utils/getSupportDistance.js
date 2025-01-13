import { Geolocation } from '@capacitor/geolocation';

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current Lat Long:', latitude, longitude);
          resolve({ latitude, longitude });
        },
        (err) => {
          console.error(`Error: ${err.message}`);
          reject(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
         forceRefresh: true
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      resolve(null);
    }
  });
}

async function getDistanceFromOSRM(lat1, lon1, lat2, lon2) {
  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&steps=true&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === "Ok") {
      const distance = data.routes[0].distance;
      console.log('Distance:', distance);
      return distance;
    } else {
      console.error('Error fetching distance:', data.code);
      return 'error';
    }
  } catch (error) {
    console.error('Error:', error);
    return 'error';
  }
}
async function getSupportDistance(clientLat, clientLng) {
  // const userLocation = await getCurrentLocation();
  // if (!userLocation) {
  //   console.error('Unable to retrieve user location');
  //   return null;
  // }
  //
  // const { latitude, longitude } = userLocation;

  const coordinates = await Geolocation.getCurrentPosition();
  const latitude = coordinates.coords.latitude;
  const longitude = coordinates.coords.longitude;

  return getDistanceFromOSRM(latitude, longitude, clientLat, clientLng);
}

export default getSupportDistance;