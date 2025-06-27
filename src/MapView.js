import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons (important for production builds)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

function MapCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

export default function MapView({ resources, userLocation }) {
  const defaultPosition = [42.7638, -71.4671];
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultPosition;

  return (
    <div className="h-[500px] w-full my-6 rounded-xl overflow-hidden shadow">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <MapCenter position={center} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {resources.map((r, i) => {
          const distance = userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng).toFixed(1)
            : null;

          return (
            <Marker key={i} position={[r.lat, r.lng]}>
              <Popup>
                <div>
                  <strong>{r.name}</strong><br />
                  {r.address}<br />
                  <em>{r.category}</em><br />
                  {distance && <div><strong>Distance:</strong> {distance} miles</div>}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}