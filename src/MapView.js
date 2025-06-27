import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const emojiIcons = {
  "Food": "🍎",
  "Shelter": "🏠",
  "Mental Health": "🧠",
  "Health & Wellness": "🏥",
  "Support Services": "🧩",
  "Crisis Support": "📞",
  "Youth Programs": "👧",
  "Community Centers": "🧑‍🤝‍🧑",
  "Education": "📚",
  "Transportation": "🚌",
  "Senior Services": "👴",
  "Veterans": "🎖",
  "Legal Assistance": "⚖️",
  "Immigration Support": "🌎",
  "Comprehensive Support": "🧭",
  "default": "📍"
};

const getEmojiIcon = (category) => {
  const emoji = emojiIcons[category] || emojiIcons.default;
  return divIcon({
    html: `<div style="font-size: 24px;">${emoji}</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

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
          <Marker position={[userLocation.lat, userLocation.lng]} icon={getEmojiIcon("default")}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {resources.map((r, i) => (
          <Marker
            key={i}
            position={[r.lat, r.lng]}
            icon={getEmojiIcon(r.category)}
          >
            <Popup>
              <strong>{emojiIcons[r.category] || emojiIcons.default} {r.name}</strong>
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