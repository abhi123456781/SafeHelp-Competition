import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const emojiIcons = {
  "Food": "\ud83c\udf4e",
  "Shelter": "\ud83c\udfe0",
  "Mental Health": "\ud83e\udde0",
  "Health & Wellness": "\ud83c\udfe5",
  "Support Services": "\ud83e\udde9",
  "Crisis Support": "\ud83d\udcde",
  "Youth Programs": "\ud83d\udc67",
  "Community Centers": "\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1",
  "Education": "\ud83d\udcda",
  "Transportation": "\ud83d\ude8c",
  "Senior Services": "\ud83d\udc74",
  "Veterans": "\ud83c\udf96",
  "Legal Assistance": "\u2696\ufe0f",
  "Immigration Support": "\ud83c\udf0e",
  "Comprehensive Support": "\ud83e\udded",
  "default": "\ud83d\udccd"
};

const getEmojiIcon = (category) => {
  const emoji = emojiIcons[category] || emojiIcons.default;
  return L.divIcon({
    html: `<div style="font-size: 24px;">${emoji}</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24]
  });
};






const userIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // pin icon
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
          attribution='Â© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={getEmojiIcon(r.category)}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {resources.map(((r, i) ) => (
          <Marker
            key={i}
            position={[r.lat, r.lng]}
            icon={getEmojiIcon(r.category)}
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