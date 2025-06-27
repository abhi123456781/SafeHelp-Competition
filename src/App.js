import { useState } from 'react';
import './index.css';
import data from './resourcesByCity.json';
import MapView from './MapView';

function App() {
  const [selectedCity, setSelectedCity] = useState('nashua-nh');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resources = data[selectedCity];
  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];
  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">SafeHelp {selectedCity.replace('-', ' ').toUpperCase()}</h1>
        <p className="text-gray-600 mb-4">Find free local food, shelter, and support services</p>

        {/* City Selector (prep for future cities) */}
        <div className="mb-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border rounded text-blue-700"
          >
            {Object.keys(data).map((city, i) => (
              <option key={i} value={city}>
                {city.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border text-sm ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 border-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Map + Resource Cards */}
      <MapView resources={filteredResources} />
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredResources.map((r, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800">{r.name}</h2>
            <p className="text-sm text-gray-600">{r.address}</p>
            <p className="text-sm"><strong>Category:</strong> {r.category}</p>
            <p className="text-sm"><strong>Hours:</strong> {r.open_hours}</p>
            <p className="text-sm"><strong>Contact:</strong> {r.contact}</p>
            <p className="text-sm"><strong>Youth Friendly:</strong> {r.youth_friendly ? 'Yes' : 'No'}</p>
            <p className="text-sm mt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
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