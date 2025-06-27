import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';


const categoryIcons = {
  "Food": "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  "Shelter": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3e0.svg",
  "Mental Health": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9e0.svg",
  "Health & Wellness": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2695.svg",
  "Support Services": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f91d.svg",
  "Crisis Support": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4de.svg",
  "Youth Programs": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f466.svg",
  "Community Centers": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f465.svg",
  "Education": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4da.svg",
  "Transportation": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f68c.svg",
  "Senior Services": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f474.svg",
  "Veterans": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f396.svg",
  "Legal Assistance": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2696.svg",
  "Immigration Support": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f30d.svg",
  "Comprehensive Support": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9f3.svg",
  "default": "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
};

const getCategoryIcon = (category) => {
  return new Icon({
    iconUrl: categoryIcons[category] || categoryIcons.default,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
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