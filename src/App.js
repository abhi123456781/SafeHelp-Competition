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
  const [selectedDropdown, setSelectedDropdown] = useState(null);
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

  // Define dropdown categories with their subcategories
  const dropdownCategories = {
    'Necessities & Shelter': {
      emoji: '🏠',
      subcategories: ['Food', 'Clothing', 'Transportation', 'Furniture & Household', 'Housing & Homelessness', 'Community Centers']
    },
    'Health & Wellness': {
      emoji: '❤️',
      subcategories: ['Medicine Lookup', 'Medical Care', 'Mental Health', 'Senior Services']
    },
    'Learning & Career': {
      emoji: '📚',
      subcategories: ['Employment Assistance', 'Education', 'Youth Programs', 'Veterans']
    },
    'Legal': {
      emoji: '⚖️',
      subcategories: ['Legal Assistance', 'Immigration Support']
    },
    'Comprehensive Support': {
      emoji: '🧭',
      subcategories: ['Comprehensive Support']
    }
  };

  const handleDropdownClick = (dropdownName) => {
    setSelectedDropdown(selectedDropdown === dropdownName ? null : dropdownName);
    setSelectedCategory('All');
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedCategory(subcategory);
    setSelectedDropdown(null);
    const matching = resources.filter(r => r.category === subcategory);

    if (userLocation && matching.length > 0) {
      const closest = matching.reduce((a, b) => {
        const dA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const dB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return dA < dB ? a : b;
      });
      setMapCenter([closest.lat, closest.lng]);
    }
  };

  const handleAllClick = () => {
    setSelectedCategory('All');
    setSelectedDropdown(null);
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
      {/* Hero Section */}
      <div className="text-center py-6 px-4">
        <h2 className="text-sm font-semibold text-[#0047AB] uppercase tracking-wide">
          Community Resource
        </h2>
        <div className="flex justify-center items-center gap-3 mt-2">
          <img src="/logo192.png" alt="SafeHelp Logo" className="h-20 w-20 md:h-20 md:w-20" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#002f6c]">SafeHelp NE</h1>
        </div>
        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Find free food, shelter, and support near you.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeh7viSbU-5DT_9XzBUHczUpByAhi8Ve1zE0I8FZSUtbTAZ-Q/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#0047AB] text-white font-medium text-sm rounded-lg shadow hover:bg-[#003b91]"
          >
            Submit a New Resource
          </a>
        </div>
      </div>

      {locationError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-4 text-center">
          ⚠️ We couldn't access your location. Map will default to Nashua.
        </div>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={handleAllClick}
          className={`px-4 py-2 rounded-full text-sm border transition ${selectedCategory === 'All'
            ? 'bg-[#0047AB] text-white border-[#0047AB]'
            : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-blue-50'
            }`}
        >
          🏠 All Resources
        </button>

        {Object.entries(dropdownCategories).map(([dropdownName, dropdownData]) => (
          <div key={dropdownName} className="relative">
            <button
              onClick={() => handleDropdownClick(dropdownName)}
              className={`px-4 py-2 rounded-full text-sm border transition ${selectedDropdown === dropdownName
                ? 'bg-[#0047AB] text-white border-[#0047AB]'
                : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-blue-50'
                }`}
            >
              {dropdownData.emoji} {dropdownName}
            </button>

            {selectedDropdown === dropdownName && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#0047AB] rounded-lg shadow-lg z-10 min-w-max">
                {dropdownData.subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg ${subcategory === 'Medicine Lookup'
                      ? 'font-bold text-red-600'
                      : 'text-[#002f6c]'
                      }`}
                  >
                    {subcategory === 'Food' && '🍽️ '}
                    {subcategory === 'Clothing' && '👕 '}
                    {subcategory === 'Transportation' && '🚌 '}
                    {subcategory === 'Furniture & Household' && '🛋️ '}
                    {subcategory === 'Housing & Homelessness' && '🏘️ '}
                    {subcategory === 'Community Centers' && '🧑‍🤝‍🧑 '}
                    {subcategory === 'Medicine Lookup' && '💊 '}
                    {subcategory === 'Medical Care' && '❤️ '}
                    {subcategory === 'Mental Health' && '🧠 '}
                    {subcategory === 'Senior Services' && '👴 '}
                    {subcategory === 'Employment Assistance' && '💼 '}
                    {subcategory === 'Education' && '📚 '}
                    {subcategory === 'Youth Programs' && '👦 '}
                    {subcategory === 'Veterans' && '🎖️ '}
                    {subcategory === 'Legal Assistance' && '⚖️ '}
                    {subcategory === 'Immigration Support' && '🌎 '}
                    {subcategory === 'Comprehensive Support' && '🧭 '}
                    {subcategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Left Side - Results List */}
        <div className="w-1/2 max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
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

        {/* Right Side - Map */}
        <div className="w-1/2">
          <MapView resources={filteredResources} userLocation={userLocation} mapCenter={mapCenter} />
        </div>
      </div>
    </div>
  );
}

export default App;