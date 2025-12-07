import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const cities = [
  { name: "Dhaka", position: [23.8103, 90.4125] },
  { name: "Chattogram", position: [22.3569, 91.7832] },
  { name: "Rajshahi", position: [24.3636, 88.6241] },
  { name: "Khulna", position: [22.8456, 89.5403] },
  { name: "Sylhet", position: [24.8949, 91.8687] },
  { name: "Barishal", position: [22.7010, 90.3535] },
  { name: "Rangpur", position: [25.7439, 89.2752] },
];

// custom marker (default ইমেজ vite এ কাজ না করলে যেন সমস্যা না হয়)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// শহর বদলালে মেপকে fly করানোর জন্য ছোট কম্পোনেন্ট
const FlyToCity = ({ city }) => {
  const map = useMap();

  useEffect(() => {
    if (city) {
      map.flyTo(city.position, 10, {
        duration: 1.5,
      });
    }
  }, [city, map]);

  return null;
};

const Coverage = () => {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    const city = cities.find(
      (c) => c.name.toLowerCase() === search.trim().toLowerCase()
    );
    if (city) {
      setSelectedCity(city);
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Delivery Coverage Maps
            </h2>
          </div>

          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1.5 w-56"
          >
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search city..."
              className="flex-1 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              list="city-list"
            />
            <datalist id="city-list">
              {cities.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </form>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          {/* Map */}
          <div className="w-full h-72 md:h-96 rounded-lg overflow-hidden shadow border border-gray-200">
            <MapContainer
              center={[23.8, 90.4]}
              zoom={7}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FlyToCity city={selectedCity} />

              {cities.map((city) => (
                <Marker
                  key={city.name}
                  position={city.position}
                  icon={markerIcon}
                >
                  <Popup>{city.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* City list */}
          <div>
            <p className="text-gray-600 mb-3 text-sm">
              BookPorter is available in these cities. Search a city from the
              box above or click on the map markers to explore.
            </p>
            <ul className="space-y-2 text-sm">
              {cities.map((city) => (
                <li
                  key={city.name}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer border ${
                    selectedCity?.name === city.name
                      ? "bg-blue-50 border-blue-400 text-blue-800"
                      : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCity(city)}
                >
                  <span>{city.name}</span>
                  <span className="text-xs text-gray-500">View on map</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coverage;
