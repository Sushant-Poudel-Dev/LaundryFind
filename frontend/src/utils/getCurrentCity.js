let city = "";

export function getCityFromCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  return fetch(url, {
    headers: {
      "User-Agent": "LaundyFind/1.0",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.hamlet
      );
    })
    .catch((error) => {
      console.error("Error getting city:", error);
      return "Unknown";
    });
}

export function getCityFromUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // ktm - 27.700769 85.300140

        const userCity = await getCityFromCoords(lat, lon);
        resolve(userCity);
      },
      (error) => {
        console.error("Geolocation error:", error);
        reject("Location access denied");
      }
    );
  });
}
