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
        [-12, 50.3, 0.9], // Northern coast
        [-14.0, 47.4, 0.8], // Northeast coast
        [-16.5, 50.5, 0.7], // East coast
        [-18.5, 50.0, 1.0], // East-central coast
        [-21.0, 49.8, 0.8], // Southeast coast
        [-23.5, 48.5, 0.7], // Southern coast
        [-26.0, 46.0, 0.9], // Southwest coast
        [-23.0, 42.5, 0.6], // West coast
        [-20.5, 43.5, 0.8], // Northwest coast
        [-18.5, 43.9, 0.7], // North-northwest coast      
    ];

  
    // Add the heatmap layer
    const heatLayer = (L as any).heatLayer(heatmapData, {
      radius: 30, // Increased radius for better visibility
      blur: 30, // Increased blur for smoother blending
      maxZoom: 6, // Maximum zoom level where the heatmap is visible
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
    const markerLayer = L.layerGroup().addTo(mapInstance); // New layer group for markers

    L.control.layers({ 'Base Map': baseLayer }, { 'Overlay Layer': overlayLayer, 'Heat Map': heatLayer, 'Markers': markerLayer }).addTo(mapInstance);

    const redIcon = L.icon({
      iconUrl: 'redIcon.png', // Replace with the path to your red icon
      iconSize: [15, 15], // Size of the icon
      iconAnchor: [15, 15], // Point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
      
    });

    mapInstance.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const marker = L.marker([lat, lng], { icon: redIcon }).addTo(markerLayer); // Add marker with red icon to markerLayer
      const popupContent = `
      <div>
        <h3>Point of Interest</h3>
        <p>Fun fact: X </p>
        <p>Information:</p>
        <button onclick="document.dispatchEvent(new CustomEvent('delete-marker', { detail: { markerId: ${L.Util.stamp(marker)} } }))">Delete Point</button>
      </div>
    `;
  
    marker.bindPopup(popupContent).openPopup();    });

    document.addEventListener('delete-marker', (e: Event) => {
      const customEvent = e as CustomEvent;
      const markerId = customEvent.detail.markerId;
      mapInstance?.eachLayer((layer) => {
        if (layer instanceof L.Marker && L.Util.stamp(layer) === markerId) {
          markerLayer.removeLayer(layer); // Remove marker from markerLayer
        }
      });
    });

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