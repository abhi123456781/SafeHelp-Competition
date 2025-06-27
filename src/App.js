
import { useState } from 'react';
import './index.css';
import data from './resourcesByCity.json';
import MapView from './MapView';

function App() {
  const [selectedCity, setSelectedCity] = useState('nashua-nh');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resources = data[selectedCity];
  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  const filteredResources =
    selectedCategory === 'All'
      ? resources
      : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">🛟 SafeHelp NE</h1>
        <p className="text-gray-600 text-lg mb-4">Find free food, shelter, and support near you.</p>

        {/* City Selector and Submit Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-blue-700"
          >
            {Object.keys(data).map((city, i) => (
              <option key={i} value={city}>
                {city.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeh7viSbU-5DT_9XzBUHczUpByAhi8Ve1zE0I8FZSUtbTAZ-Q/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
          >
            ➕ Submit a New Resource
          </a>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={\`px-4 py-1 rounded-full text-sm border transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-700 border-blue-500 hover:bg-blue-100'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Map View */}
      <MapView resources={filteredResources} />

      {/* Resource Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredResources.map((r, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-900">{r.name}</h2>
            <p className="text-sm text-gray-600">{r.address}</p>
            <p className="text-sm"><strong>Category:</strong> {r.category}</p>
            <p className="text-sm"><strong>Hours:</strong> {r.open_hours}</p>
            <p className="text-sm"><strong>Contact:</strong> {r.contact}</p>
            <p className="text-sm"><strong>Youth Friendly:</strong> {r.youth_friendly ? 'Yes' : 'No'}</p>
            <p className="text-sm mt-2">
              <a
                href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(r.address)}\`}
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
