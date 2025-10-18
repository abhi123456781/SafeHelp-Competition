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

  // Medicine Lookup states
  const [medicineName, setMedicineName] = useState('');
  const [showMedicineResults, setShowMedicineResults] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showActiveIngredient, setShowActiveIngredient] = useState(false);
  const [showStoreAlternatives, setShowStoreAlternatives] = useState(false);
  const [isLoadingIngredient, setIsLoadingIngredient] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [ingredientDots, setIngredientDots] = useState('');
  const [storeDots, setStoreDots] = useState('');

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

  // Typing animation for ingredient loading
  useEffect(() => {
    if (isLoadingIngredient) {
      const interval = setInterval(() => {
        setIngredientDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setIngredientDots('');
    }
  }, [isLoadingIngredient]);

  // Typing animation for store loading
  useEffect(() => {
    if (isLoadingStores) {
      const interval = setInterval(() => {
        setStoreDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setStoreDots('');
    }
  }, [isLoadingStores]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedDropdown && !event.target.closest('.dropdown-container')) {
        setSelectedDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDropdown]);

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
    }
  };

  const handleDropdownClick = (dropdownName) => {
    setSelectedDropdown(selectedDropdown === dropdownName ? null : dropdownName);
    // Don't reset selectedCategory - keep the current selection
  };

  const handleDropdownMouseEnter = (dropdownName) => {
    setSelectedDropdown(dropdownName);
  };

  const handleDropdownMouseLeave = (event) => {
    // Check if mouse is moving to a child element within the dropdown container
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget || !relatedTarget.closest('.dropdown-container')) {
      // Only close if mouse is truly leaving the dropdown area
      setSelectedDropdown(null);
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedCategory(subcategory);
    setSelectedDropdown(null);

    if (subcategory === 'Medicine Lookup') {
      // Only reset if no medicine has been searched yet
      if (!medicineName) {
        setShowMedicineResults(false); // Show input form first
        setAvailabilityStatus({}); // Reset availability status
        setShowActiveIngredient(false);
        setShowStoreAlternatives(false);
        setIsLoadingIngredient(false);
        setIsLoadingStores(false);
      } else {
        // If medicine has been searched, show the results
        setShowMedicineResults(true);
      }
      return;
    }

    // Don't reset Medicine Lookup states when switching to other categories
    // This preserves the medicine search results
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
    // Don't reset Medicine Lookup states - preserve the search results
  };

  const handleMedicineSubmit = (e) => {
    e.preventDefault();
    if (medicineName.toLowerCase().includes('benadryl')) {
      setShowMedicineResults(true);
      setShowActiveIngredient(false);
      setShowStoreAlternatives(false);

      // Start AI loading sequence
      setIsLoadingIngredient(true);

      // Simulate AI analyzing medicine after 2 seconds
      setTimeout(() => {
        setIsLoadingIngredient(false);
        setShowActiveIngredient(true);

        // Start loading stores after ingredient is shown
        setIsLoadingStores(true);

        // Simulate AI finding store alternatives after 3 more seconds
        setTimeout(() => {
          setIsLoadingStores(false);
          setShowStoreAlternatives(true);
        }, 3000);
      }, 2000);
    } else {
      alert('Please enter "Benadryl" for this demo');
    }
  };

  const handleCheckAvailability = (storeName) => {
    setAvailabilityStatus(prev => ({
      ...prev,
      [storeName]: 'checking'
    }));

    // Simulate AI checking after 1 minute
    setTimeout(() => {
      setAvailabilityStatus(prev => ({
        ...prev,
        [storeName]: 'available'
      }));
      setNotificationMessage(`Availability Check with ${storeName} complete! Status: Available`);
      setShowNotification(true);

      // Auto-dismiss notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }, 60000); // 1 minute for demo
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    setSelectedCategory('Medicine Lookup');
    setShowMedicineResults(true);
  };

  // Check if a dropdown should be highlighted based on selected category
  const isDropdownHighlighted = (dropdownName) => {
    if (selectedCategory === 'All' || selectedCategory === 'Comprehensive Support') return false;
    const dropdownData = dropdownCategories[dropdownName];
    return dropdownData && dropdownData.subcategories.includes(selectedCategory);
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
      {/* Notification */}
      {showNotification && (
        <div
          className="fixed top-4 right-4 bg-white border-2 border-green-500 rounded-lg shadow-lg p-6 z-[10000] cursor-pointer hover:shadow-xl transition-shadow min-w-[300px]"
          onClick={handleNotificationClick}
        >
          <p className="text-base font-medium">
            {notificationMessage.split('Available')[0]}
            <span className="text-green-600 font-bold">Available</span>
          </p>
        </div>
      )}
      {/* Hero Section */}
      <div className="text-center py-6 px-4">
        <h2 className="text-sm font-semibold text-[#0047AB] uppercase tracking-wide">
          Created by Abhinav Mareedu & Nithin Venkatramanan
        </h2>
        <div className="flex justify-center items-center gap-3 mt-2">
          <img src="/logo192.png" alt="SafeHelp Logo" className="h-20 w-20 md:h-20 md:w-20" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#002f6c]">SafeHelp NE</h1>
        </div>
        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Find support near you.
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
      <div className="flex flex-wrap justify-center gap-2 mb-6 relative z-50">
        <button
          onClick={handleAllClick}
          className={`px-4 py-2 rounded-full text-sm border-2 transition ${selectedCategory === 'All'
            ? 'bg-[#0047AB] text-white border-[#0047AB]'
            : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-[#0047AB] hover:text-white hover:border-[#0047AB]'
            }`}
        >
          🏠 All Resources
        </button>

        {Object.entries(dropdownCategories).map(([dropdownName, dropdownData]) => (
          <div key={dropdownName} className="relative dropdown-container" style={{ position: 'relative' }}>
            <button
              onClick={() => handleDropdownClick(dropdownName)}
              onMouseEnter={() => handleDropdownMouseEnter(dropdownName)}
              onMouseLeave={handleDropdownMouseLeave}
              className={`px-4 py-2 rounded-full text-sm border-2 transition flex items-center gap-1 ${selectedDropdown === dropdownName || isDropdownHighlighted(dropdownName)
                ? 'bg-[#0047AB] text-white border-[#0047AB]'
                : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-[#0047AB] hover:text-white hover:border-[#0047AB]'
                }`}
            >
              {dropdownData.emoji} {dropdownName}
              <svg
                className={`w-4 h-4 transition-transform ${selectedDropdown === dropdownName ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {selectedDropdown === dropdownName && (
              <div
                className="absolute z-[9999] w-max max-w-xs animate-in slide-in-from-top-2 duration-300"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  transform: 'translateY(0)',
                  willChange: 'transform'
                }}
                onMouseEnter={() => handleDropdownMouseEnter(dropdownName)}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="flex flex-col gap-1 pt-2">
                  {dropdownData.subcategories.map((subcategory, index) => (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className={`px-4 py-2 rounded-full text-sm border-2 transition-all duration-200 whitespace-nowrap text-left animate-in slide-in-from-left-2 duration-300 shadow-lg ${selectedCategory === subcategory
                        ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-xl'
                        : subcategory === 'Medicine Lookup'
                          ? 'font-bold text-red-600 border-red-400 bg-red-50 hover:bg-red-100 hover:border-red-500 hover:shadow-xl'
                          : 'text-[#002f6c] border-[#0047AB] bg-white hover:bg-[#0047AB] hover:text-white hover:border-[#0047AB] hover:shadow-xl'
                        }`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
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
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => handleSubcategoryClick('Comprehensive Support')}
          className={`px-4 py-2 rounded-full text-sm border-2 transition ${selectedCategory === 'Comprehensive Support'
            ? 'bg-[#0047AB] text-white border-[#0047AB]'
            : 'bg-white text-[#0047AB] border-[#0047AB] hover:bg-[#0047AB] hover:text-white hover:border-[#0047AB]'
            }`}
        >
          🧭 Comprehensive Support
        </button>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex gap-6 max-w-7xl mx-auto relative z-10" style={{ position: 'relative' }}>
        {/* Left Side - Results List */}
        <div className="w-1/2 max-h-[600px] overflow-y-auto">
          {selectedCategory === 'Medicine Lookup' ? (
            <div>
              {/* Medicine Lookup Interface */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#002f6c] mb-2">
                  💊 Medicine Lookup
                </h3>
                <p className="text-sm text-gray-600">
                  Find affordable alternatives to your medication
                </p>
              </div>

              {!showMedicineResults ? (
                <div className="bg-white border border-[#0047AB] rounded-xl shadow p-6">
                  <form onSubmit={handleMedicineSubmit}>
                    <label className="block text-sm font-medium text-[#002f6c] mb-2">
                      Name of Medicine:
                    </label>
                    <input
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="Enter medicine name (e.g., Tylenol, Advil, etc.)"
                      className="w-full px-3 py-2 border border-[#0047AB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] mb-4"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0047AB] text-white rounded-lg hover:bg-[#003b91] transition-colors"
                    >
                      Search Medicine
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Medicine Name Display */}
                  <div className="bg-white border border-[#0047AB] rounded-xl shadow p-5">
                    <h4 className="text-lg font-semibold text-[#002f6c] mb-2">
                      Medicine Name: {medicineName}
                    </h4>

                    {/* Active Ingredient Section */}
                    {isLoadingIngredient ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0047AB]"></div>
                        <span>Analyzing medicine{ingredientDots}</span>
                      </div>
                    ) : showActiveIngredient ? (
                      <p className="text-sm text-gray-600">
                        <strong>Active Ingredient:</strong> Diphenhydramine HCl (25mg)
                      </p>
                    ) : null}
                  </div>

                  {/* Affordable Alternatives */}
                  {showActiveIngredient && (
                    <div className="bg-white border border-[#0047AB] rounded-xl shadow p-5">
                      <h4 className="text-lg font-semibold text-[#002f6c] mb-4">
                        Affordable & Reliable Alternatives:
                      </h4>

                      {isLoadingStores ? (
                        <div className="flex items-center justify-center gap-2 py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0047AB]"></div>
                          <span className="text-gray-600">Finding alternatives{storeDots}</span>
                        </div>
                      ) : showStoreAlternatives ? (
                        <div className="space-y-4">
                          {/* CVS Option */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h5 className="font-semibold text-[#002f6c]">
                                  <a
                                    href="https://www.cvs.com/shop/cvs-health-diphenhydramine-hcl-25mg-tablets-100ct-prodid-1012012"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0047AB] hover:underline"
                                  >
                                    CVS Health Diphenhydramine
                                  </a>
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">100 tablets</p>
                                <p className="text-lg font-bold text-green-600">$6.79</p>
                                <p className="text-sm text-gray-500 mb-3">
                                  <strong>Active Ingredient:</strong> Diphenhydramine HCl (25mg)
                                </p>
                                <button
                                  onClick={() => handleCheckAvailability('CVS')}
                                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${availabilityStatus['CVS'] === 'checking'
                                    ? 'bg-yellow-500 text-white'
                                    : availabilityStatus['CVS'] === 'available'
                                      ? 'bg-green-100 text-green-800 border border-green-300'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                  {availabilityStatus['CVS'] === 'checking'
                                    ? 'Contacting Store...'
                                    : availabilityStatus['CVS'] === 'available'
                                      ? <span>Availability Status: <span className="font-bold text-green-600">Available</span></span>
                                      : 'Check Availability using AI'
                                  }
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Walgreens Option */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h5 className="font-semibold text-[#002f6c]">
                                  <a
                                    href="https://www.walgreens.com/store/c/walgreens-diphenhydramine-hcl-25mg-tablets/ID=prod6258140-product"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0047AB] hover:underline"
                                  >
                                    Walgreens Diphenhydramine
                                  </a>
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">100 tablets</p>
                                <p className="text-lg font-bold text-green-600">$4.99</p>
                                <p className="text-sm text-gray-500 mb-3">
                                  <strong>Active Ingredient:</strong> Diphenhydramine HCl (25mg)
                                </p>
                                <button
                                  onClick={() => handleCheckAvailability('Walgreens')}
                                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${availabilityStatus['Walgreens'] === 'checking'
                                    ? 'bg-yellow-500 text-white'
                                    : availabilityStatus['Walgreens'] === 'available'
                                      ? 'bg-green-100 text-green-800 border border-green-300'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                  {availabilityStatus['Walgreens'] === 'checking'
                                    ? 'Contacting Store...'
                                    : availabilityStatus['Walgreens'] === 'available'
                                      ? <span>Availability Status: <span className="font-bold text-green-600">Available</span></span>
                                      : 'Check Availability using AI'
                                  }
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Target Option */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h5 className="font-semibold text-[#002f6c]">
                                  <a
                                    href="https://www.target.com/p/up-up-diphenhydramine-hcl-25mg-tablets-100ct/-/A-13378020"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0047AB] hover:underline"
                                  >
                                    Target Up&Up Diphenhydramine
                                  </a>
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">100 tablets</p>
                                <p className="text-lg font-bold text-green-600">$3.59</p>
                                <p className="text-sm text-gray-500 mb-3">
                                  <strong>Active Ingredient:</strong> Diphenhydramine HCl (25mg)
                                </p>
                                <button
                                  onClick={() => handleCheckAvailability('Target')}
                                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${availabilityStatus['Target'] === 'checking'
                                    ? 'bg-yellow-500 text-white'
                                    : availabilityStatus['Target'] === 'available'
                                      ? 'bg-green-100 text-green-800 border border-green-300'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                  {availabilityStatus['Target'] === 'checking'
                                    ? 'Contacting Store...'
                                    : availabilityStatus['Target'] === 'available'
                                      ? <span>Availability Status: <span className="font-bold text-green-600">Available</span></span>
                                      : 'Check Availability using AI'
                                  }
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Section Title */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#002f6c] mb-2">
                  {selectedCategory === 'All'
                    ? '🏠 All Resources'
                    : selectedCategory === 'Comprehensive Support'
                      ? '🧭 Comprehensive Support'
                      : `📋 ${selectedCategory}`
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
                </p>
              </div>
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
            </>
          )}
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