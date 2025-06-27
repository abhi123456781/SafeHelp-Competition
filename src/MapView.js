import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import foodIconUrl from './icons/food.svg';
import shelterIconUrl from './icons/shelter.svg';
import mentalIconUrl from './icons/mental.svg';
import crisisIconUrl from './icons/crisis.svg';
import supportIconUrl from './icons/support.svg';
import healthIconUrl from './icons/health.svg';
import defaultIconUrl from './icons/default.svg';
import pinIconUrl from './icons/pin.svg';

const categoryIcons = {
  Food: foodIconUrl,
  Shelter: shelterIconUrl,
  'Mental Health': mentalIconUrl,
  'Crisis Support': crisisIconUrl,
  'Support Services': supportIconUrl,
  'Health & Wellness': healthIconUrl,
};

const getCategoryIcon = (category) => {
  return new Icon({
    iconUrl: categoryIcons[category] || defaultIconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const userIcon = new Icon({
  iconUrl: pinIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function RecenterMap({ center }) {
  const map = useMap();
  if (center) {
    map.setView(center, 14);
  }
  return null;
}

export default function MapView({ resources, userLocation, mapCenter }) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={mapCenter || [42.7653, -71.4676]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <RecenterMap center={mapCenter} />
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {resources.map((r, i) => (
          <Marker
            key={i}
            position={[r.lat, r.lng]}
            icon={getCategoryIcon(r.category)}
          >
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.address}
              {r.distance && (
                <>
                  <br />
                  Distance: {r.distance.toFixed(1)} miles
                </>
              )}
              <br />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}