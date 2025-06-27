import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Online icon URLs for each category
const categoryIcons = {
  Food: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  Shelter: "https://cdn-icons-png.flaticon.com/512/2271/2271343.png",
  "Mental Health": "https://cdn-icons-png.flaticon.com/512/3126/3126554.png",
  "Crisis Support": "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
  "Support Services": "https://cdn-icons-png.flaticon.com/512/2460/2460595.png",
  "Health & Wellness": "https://cdn-icons-png.flaticon.com/512/1484/1484815.png",
  default: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
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
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
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