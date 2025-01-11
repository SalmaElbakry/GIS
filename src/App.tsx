import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import './App.css';


const App: React.FC = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false); // Sidebar visibility
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false); // Filter menu visibility

  useEffect(() => {
    const mapInstance = L.map('map', {zoomControl: false, }).setView([-18.8792, 47.5079], 6); // Madagascar coordinates

    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    const heatmapData = [
      [-18.8792, 47.5079, 1.0], // Antananarivo
      [-20.9394, 48.4647, 0.8], // Toamasina
      [-21.4533, 47.0854, 0.7], // Fianarantsoa
      [-22.3561, 47.2254, 0.9], // Toliara
      [-24.8662, 46.8375, 0.6], // Fort Dauphin (Taolagnaro)
      [-16.9862, 49.4257, 0.8], // Antsiranana (Diego Suarez)
      [-19.9833, 47.4667, 0.5], // Moramanga
      [-17.6558, 49.4872, 0.7], // Sambava
      [-19.5667, 46.8833, 0.6], // Miandrivazo
      [-17.3667, 48.2667, 0.9], // Mahajanga
    ];

  
    // Add the heatmap layer
    const heatLayer = L.heatLayer(heatmapData, {
      radius: 40, // Increased radius for better visibility
      blur: 25, // Increased blur for smoother blending
      maxZoom: 10, // Maximum zoom level where the heatmap is visible
      max: 1.0, // Maximum intensity value for normalization
      gradient: {
        0.1: 'blue',  // Lower intensity
        0.3: 'cyan',  // Light cyan for mid-low intensity
        0.5: 'lime',  // Green for medium intensity
        0.7: 'yellow', // Yellow for higher intensity
        0.9: 'orange',  // Orange for high intensity
        1.0: 'red',  // Red for maximum intensity
      }, // Intense gradient colors
    }).addTo(mapInstance);

    setMap(mapInstance);

    const overlayLayer = L.layerGroup();

    L.control.layers({ 'Base Map': baseLayer }, { 'Overlay Layer': overlayLayer },{ 'Heat Map': heatLayer }).addTo(mapInstance);

    mapInstance.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const marker = L.marker([lat, lng]).addTo(mapInstance);
      const popupContent = `
      <div>
        <h3>Point of Interest</h3>
        <p>Fun fact: X </p>
        <p>Information:</p>
        <button onclick="alert('This is a custom action!')">Click Me</button>
      </div>
    `;
  
    marker.bindPopup(popupContent).openPopup();    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const toggleFilterMenu = () => {
    setFilterMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="app-container">
      <div id="map" className={sidebarOpen ? 'map-with-sidebar' : 'map-full'}></div>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          {/* Filter Dropdown */}
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={toggleFilterMenu}
            >
              Filter
            </button>
            {filterMenuOpen && (
              <div className="filter-menu">
                <label>
                  <input type="checkbox" />
                  Option 1
                </label>
                <label>
                  <input type="checkbox" />
                  Option 2
                </label>
                <label>
                  <input type="checkbox" />
                  Option 3
                </label>
              </div>
            )}
          </div>
          <button className="layer-control-placeholder">Layer Control Button</button>
        </div>
      </div>
      {/* Persistent toggle button */}
      <button
        className={`toggle-sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? '<' : '>'}
      </button>
    </div>
  );
};

export default App;

