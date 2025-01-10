import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
const App: React.FC = () => {
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    const mapInstance = L.map('map').setView([-18.8792, 47.5079], 7); // Madagascar coordinates

    // Base map tile layers
    const baseLayer1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const baseLayer2 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://opentopomap.org/copyright">OpenTopoMap</a> contributors',
    });

    const overlayLayer = L.layerGroup();

    // Create the layer control, now using checkboxes for toggling
    const layerControl = L.control.layers({}, { 'Overlay Layer': overlayLayer }).addTo(mapInstance);

    // Add base layers to the map, no need for radio buttons
    const baseLayers = {
      "OpenStreetMap": baseLayer1,
      "OpenTopoMap": baseLayer2
    };

    // Add the base layer toggle manually (no radio buttons, just toggle behavior)
    let currentBaseLayer = baseLayer1;  // Default base layer
    baseLayer1.addTo(mapInstance);  // Add the default base layer to the map

    // Add layer toggle buttons
    const baseLayerControlDiv = L.DomUtil.create('div', 'leaflet-control-layers-base');
    baseLayerControlDiv.style.position = 'absolute';
    baseLayerControlDiv.style.top = '10px';
    baseLayerControlDiv.style.right = '50px';
    baseLayerControlDiv.style.zIndex = '1000';

    const toggleBaseMapButton = L.DomUtil.create('button', 'leaflet-base-toggle', baseLayerControlDiv);
    toggleBaseMapButton.innerText = 'Toggle Base Map';

    L.DomEvent.on(toggleBaseMapButton, 'click', () => {
      if (currentBaseLayer === baseLayer1) {
        mapInstance.removeLayer(baseLayer1);
        baseLayer2.addTo(mapInstance);
        currentBaseLayer = baseLayer2;
      } else {
        mapInstance.removeLayer(baseLayer2);
        baseLayer1.addTo(mapInstance);
        currentBaseLayer = baseLayer1;
      }
    });

    // Add the custom control to the map
    // mapInstance.getContainer().appendChild(baseLayerControlDiv);

    mapInstance.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const marker = L.marker([lat, lng]).addTo(mapInstance);
      marker.bindPopup(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '100vh', width: '100%' }}></div>
      <button id="filter-btn" className="filter-button">Filter</button>
    </div>
  );
};

export default App;