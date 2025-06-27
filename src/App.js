import { useState, useEffect } from 'react';
import './index.css';
import data from './resourcesByCity.json';
import MapView from './MapView';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 0.621371;
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setMapCenter([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        console.warn('Geolocation failed or not allowed');
        setLocationError(true);
        setMapCenter([42.7653, -71.4676]);
      }
    );
  }, []);

  const resources = data.resources;
  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const matching =
      category === 'All'
        ? resources
        : resources.filter(r => r.category === category);

    if (userLocation && matching.length > 0) {
      const closest = matching.reduce((a, b) => {
        const dA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const dB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return dA < dB ? a : b;
      });
      setMapCenter([closest.lat, closest.lng]);
    }
  };

  let filteredResources =
    selectedCategory === 'All'
      ? resources
      : resources.filter(r => r.category === selectedCategory);

  if (userLocation) {
    filteredResources = filteredResources
      .map(r => ({
        ...r,
        distance: calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng)
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  return (
    <div className="min-h-screen bg-white text-[#002f6c] p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#0047AB] mb-2">SafeHelp NE</h1>
        <p className="text-lg mb-4">Find free food, shelter, and support near you.</p>

        {locationError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-4">
            ⚠️ We couldn't access your location. Map will default to Nashua.
          </div>
        )}

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeh7viSbU-5DT_9XzBUHczUpByAhi8Ve1zE0I8FZSUtbTAZ-Q/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-4 px-4 py-2 text-white bg-[#0047AB] hover:bg-[#e6f0ff] rounded-lg text-sm"
        >
          ➕ Submit a New Resource
        </a>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                selectedCategory === cat
                  ? 'bg-[#0047AB] text-white border-[#0047AB]'
                  : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-[#e6f0ff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <MapView resources={filteredResources} userLocation={userLocation} mapCenter={mapCenter} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredResources.map((r, i) => (
          <div key={i} className="bg-white border border-[#0047AB] rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-[#002f6c]">{r.name}</h2>
            <p className="text-sm text-[#0047AB]">{r.address}</p>
            <p className="text-sm"><strong>Category:</strong> {r.category}</p>
            <p className="text-sm"><strong>Hours:</strong> {r.open_hours}</p>
            <p className="text-sm"><strong>Contact:</strong> {r.contact}</p>
            <p className="text-sm"><strong>Youth Friendly:</strong> {r.youth_friendly ? 'Yes' : 'No'}</p>
            {r.distance && (
              <p className="text-sm"><strong>Distance:</strong> {r.distance.toFixed(1)} miles</p>
            )}
            <p className="text-sm mt-2">
              <a
                href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(r.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0047AB] underline"
              >
                View on Google Maps
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;