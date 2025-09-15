// components/MapComponent.jsx
// Karte die mit deiner API verbunden ist

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

const MapComponent = ({ countries = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Karte schon erstellt

    console.log('Erstelle MapLibre Karte...');

    // Karte erstellen
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Kostenlose Karte
      center: [10, 50], // Europa Zentrum (Deutschland)
      zoom: 4
    });

    // Navigation Controls hinzufügen (Zoom Buttons)
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Karte fertig geladen
    map.current.on('load', () => {
      console.log('MapLibre Karte geladen!');
    });

    console.log('MapLibre Karte erstellt!');
  }, []);

  // Marker hinzufügen/aktualisieren wenn sich countries ändert
  useEffect(() => {
    if (!map.current) return;

    console.log('Aktualisiere Marker für', countries.length, 'Länder');

    // Alle alten Marker entfernen
    const existingMarkers = document.querySelectorAll('.maplibregl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Für jedes Land aus der API einen roten Marker erstellen
    countries.forEach((country, index) => {
      if (country.latitude && country.longitude) {
        console.log(`Erstelle Marker ${index + 1}:`, country.name, country.latitude, country.longitude);

        // Roten Marker erstellen
        const marker = new maplibregl.Marker({
          color: '#DC2626', // Rot für Goldreserven
          scale: 1.3        // Etwas größer
        })
          .setLngLat([country.longitude, country.latitude])
          .addTo(map.current);

        // Popup mit Goldreserven-Info aus der API
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div style="padding: 12px; min-width: 220px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px; border-bottom: 2px solid #DC2626; padding-bottom: 5px;">
              ${country.name}
            </h3>
            
            <div style="margin: 8px 0;">
              <strong style="color: #555;">Hauptstadt:</strong> 
              <span style="color: #333;">${country.capital}</span>
            </div>
            
            <div style="margin: 8px 0;">
              <strong style="color: #DC2626;">Goldreserven:</strong> 
              <span style="color: #DC2626; font-weight: bold; font-size: 16px;">${country.goldReserves} Tonnen</span>
            </div>
            
            <div style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #eee;">
              <small style="color: #888;">
                Koordinaten: ${country.latitude?.toFixed(2)}, ${country.longitude?.toFixed(2)}
              </small>
            </div>
            
            ${country.createdAt ? `
              <div style="margin: 4px 0 0 0;">
                <small style="color: #888;">
                  Hinzugefügt: ${new Date(country.createdAt).toLocaleDateString('de-DE')}
                </small>
              </div>
            ` : ''}
          </div>
        `);

        marker.setPopup(popup);

        // Automatisch das erste neue Land fokussieren
        if (index === countries.length - 1 && countries.length === 1) {
          setTimeout(() => {
            map.current.flyTo({
              center: [country.longitude, country.latitude],
              zoom: 6,
              duration: 2000
            });
          }, 500);
        }
      } else {
        console.log('Keine Koordinaten für:', country.name);
      }
    });

    // Wenn mehrere Länder da sind - alle in den Blick nehmen
    if (countries.length > 1) {
      const coordinates = countries
        .filter(c => c.latitude && c.longitude)
        .map(c => [c.longitude, c.latitude]);

      if (coordinates.length > 1) {
        setTimeout(() => {
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

          map.current.fitBounds(bounds, {
            padding: 60,
            duration: 1500,
            maxZoom: 8
          });
        }, 500);
      }
    }
  }, [countries]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '450px',        // Gute Höhe
          borderRadius: '10px',
          border: '2px solid #ddd',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }} 
      />
      
      {/* Info unter der Karte */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '12px',
        fontSize: '14px',
        color: '#666',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        {countries.length === 0 ? (
          <p style={{ margin: 0 }}>
            🗺️ Karte wird angezeigt sobald du ein Land hinzufügst
          </p>
        ) : (
          <div>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
              📍 {countries.length} Land{countries.length !== 1 ? 'er' : ''} auf der Karte
            </p>
            <p style={{ margin: 0, fontSize: '12px' }}>
              Klicke auf die roten Punkte für Details zu den Goldreserven
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;