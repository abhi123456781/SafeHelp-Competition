import { useState } from 'react';
import './index.css';
import resources from './resources.json'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">SafeHelp Nashua</h1>
        <p className="text-gray-600 mb-4">Find free local food, shelter, and support services</p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full border ${
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

      {/* Resource Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((r, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800">{r.name}</h2>
            <p className="text-sm text-gray-600">{r.address}</p>
            <p className="text-sm"><strong>Category:</strong> {r.category}</p>
            <p className="text-sm"><strong>Hours:</strong> {r.open_hours}</p>
            <p className="text-sm"><strong>Contact:</strong> {r.contact}</p>
            <p className="text-sm"><strong>Youth Friendly:</strong> {r.youth_friendly ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;