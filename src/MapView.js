import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import resources from './resourcesByCity.json';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapView() {
  const position = [42.7638, -71.4671]; // Center of Nashua

  return (
    <div className="h-[500px] w-full my-6 rounded-xl overflow-hidden shadow">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {resources.map((r, i) => (
          <Marker key={i} position={[r.lat, r.lng]}>
            <Popup>
              <div>
                <strong>{r.name}</strong><br />
                {r.address}<br />
                <em>{r.category}</em><br />
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
        ))}
      </MapContainer>
    </div>
  );
}