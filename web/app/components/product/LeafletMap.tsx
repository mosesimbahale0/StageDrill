import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Default Blue Icon (User Location) ---
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Custom Yellow Icon (Product Location) ---
const yellowIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- Helper Component to Center Map ---
function RecenterMap({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 12);
  }, [position, map]);
  return null;
}

// --- Main Map Component ---
export default function LeafletMap({ locations = [] }: { locations: any[] }) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );

  // Extract product coordinates (assume one main product)
  const product = locations[0];
  let productPosition: [number, number] | null = null;

  // Support both numeric lat/lng and "Lat: -1.26780, Lon: 36.73210" format
  if (product?.display_location) {
    const match = product.display_location.match(
      /Lat:\s*(-?\d+\.\d+),\s*Lon:\s*(-?\d+\.\d+)/
    );
    if (match) {
      productPosition = [parseFloat(match[1]), parseFloat(match[2])];
    }
  } else if (product?.lat && product?.lng) {
    productPosition = [product.lat, product.lng];
  }

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback to Nairobi CBD
          setUserPosition([-1.286389, 36.817223]);
        }
      );
    } else {
      setUserPosition([-1.286389, 36.817223]);
    }
  }, []);

  if (!userPosition) {
    return (
      <div className="w-full h-full bg-secondary flex items-center justify-center text-text2">
        Loading map...
      </div>
    );
  }

  // Determine center — prioritize product location if available
  const mapCenter = productPosition || userPosition;

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 2 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* --- 🧍 User Location Marker --- */}
      {userPosition && (
        <Marker position={userPosition} icon={defaultIcon}>
          <Tooltip
            permanent
            direction="top"
            offset={[0, -30]}
            className="bg-blue-600 text-white rounded-md px-2 py-1 text-xs shadow-md"
          >
            <div style={{ textAlign: "center" }}>You are here 📍</div>
          </Tooltip>
          <Popup>
            <strong>Your Location</strong>
            <br />
            Lat: {userPosition[0].toFixed(5)}, Lon: {userPosition[1].toFixed(5)}
          </Popup>
        </Marker>
      )}

      {/* --- 🛒 Product Location Marker --- */}
      {productPosition && (
        <Marker position={productPosition} icon={yellowIcon}>
          <Tooltip
            permanent
            direction="top"
            offset={[0, -30]}
            className="bg-yellow-600 text-black rounded-md px-2 py-1 text-xs shadow-md"
          >
            <div style={{ textAlign: "center" }}>
              <strong>{product.product_name}</strong>
              <br />
              KES {product.price}
            </div>
          </Tooltip>
          <Popup>
            <strong>{product.product_name}</strong>
            <br />
            Price: KES {product.price}
            <br />
            Status: {product.status || "Available"}
            <br />
            Location: {product.display_location}
          </Popup>
        </Marker>
      )}

      <RecenterMap position={mapCenter} />
    </MapContainer>
  );
}
