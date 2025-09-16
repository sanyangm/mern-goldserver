// components/MapComponent.jsx
// MapLibre-Karte mit Markern für Goldreserven

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const MapComponent = ({ countries = [], height = 400 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Karte initialisieren
  useEffect(() => {
    if (map.current) return; // Bereits initialisiert

    console.log("Initialisiere MapLibre Karte...");

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/globe.json", // gewünschter Style
      center: [0, 0], // Startposition wie gewünscht
      zoom: 1, // Startzoom wie gewünscht
      attributionControl: true,
    });

    // Navigation Controls (Zoom Buttons)
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Karte geladen
    map.current.on("load", () => {
      console.log("MapLibre Karte geladen");
    });

    // Error Handling
    map.current.on("error", (e) => {
      console.error("MapLibre Fehler:", e);
    });
  }, []);

  // Marker aktualisieren wenn sich countries ändert
  useEffect(() => {
    if (!map.current) return;

    console.log(`Aktualisiere Marker für ${countries.length} Länder`);

    // Alle existierenden Marker entfernen
    const existingMarkers = document.querySelectorAll(".maplibregl-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Marker für jedes Land mit Koordinaten erstellen
    const validCountries = countries.filter(
      (c) =>
        c.latitude != null &&
        c.longitude != null &&
        !isNaN(c.latitude) &&
        !isNaN(c.longitude)
    );

    validCountries.forEach((country, index) => {
      try {
        console.log(
          `Erstelle Marker für ${country.name}:`,
          country.latitude,
          country.longitude
        );

        // Roten Marker erstellen
        const marker = new maplibregl.Marker({
          color: "#ef4444", // Rot passend zu deinem Button-Style
          scale: 1.2,
        })
          .setLngLat([Number(country.longitude), Number(country.latitude)])
          .addTo(map.current);

        // Popup mit Land-Informationen
        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          className: "custom-popup",
        }).setHTML(`
          <div style="
            padding: 12px; 
            min-width: 200px; 
            font-family: system-ui, -apple-system, sans-serif;
            background: #1e293b;
            color: #f1f5f9;
            border-radius: 8px;
          ">
            <h4 style="
              margin: 0 0 8px 0; 
              color: #f1f5f9; 
              font-size: 16px; 
              font-weight: 700;
              border-bottom: 2px solid #ef4444;
              padding-bottom: 4px;
            ">
              ${country.name}
            </h4>
            
            <p style="margin: 6px 0; color: #cbd5e1; font-size: 14px;">
              <strong>Hauptstadt:</strong> ${country.capital || "—"}
            </p>
            
            <p style="
              margin: 6px 0; 
              color: #ef4444; 
              font-weight: 700; 
              font-size: 15px;
            ">
              <strong>Goldreserven:</strong> ${Number(
                country.goldReserves || 0
              )} Tonnen
            </p>
            
            <p style="
              margin: 8px 0 0 0; 
              padding-top: 6px; 
              border-top: 1px solid #374151;
              color: #94a3b8; 
              font-size: 12px;
            ">
              ${Number(country.latitude).toFixed(2)}°, ${Number(
          country.longitude
        ).toFixed(2)}°
            </p>
            
            ${
              country.createdAt
                ? `
              <p style="
                margin: 4px 0 0 0; 
                color: #64748b; 
                font-size: 11px;
              ">
                ${new Date(country.createdAt).toLocaleDateString("de-DE")}
              </p>
            `
                : ""
            }
          </div>
        `);

        marker.setPopup(popup);
      } catch (error) {
        console.error(
          `Fehler beim Erstellen des Markers für ${country.name}:`,
          error
        );
      }
    });

    // Kamera an alle Marker anpassen
    if (validCountries.length > 0) {
      setTimeout(() => {
        try {
          if (validCountries.length === 1) {
            // Ein Land: Direkt hinzoomen
            const country = validCountries[0];
            map.current.flyTo({
              center: [Number(country.longitude), Number(country.latitude)],
              zoom: 6,
              duration: 1500,
            });
          } else if (validCountries.length > 1) {
            // Mehrere Länder: Alle in den Blick nehmen
            const coordinates = validCountries.map((c) => [
              Number(c.longitude),
              Number(c.latitude),
            ]);

            const bounds = coordinates.reduce((bounds, coord) => {
              return bounds.extend(coord);
            }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

            map.current.fitBounds(bounds, {
              padding: 50,
              duration: 1500,
              maxZoom: 8,
            });
          }
        } catch (error) {
          console.error("Fehler beim Anpassen der Kamera:", error);
        }
      }, 300);
    }
  }, [countries]);

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const validCountriesCount = countries.filter(
    (c) => c.latitude != null && c.longitude != null
  ).length;

  return (
    <div>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: `${height}px`,
          borderRadius: "12px",
          border: "1px solid var(--border, #374151)",
          overflow: "hidden",
          background: "#1e293b",
        }}
      />

      {/* Info unter der Karte */}
      <div
        style={{
          textAlign: "center",
          marginTop: "12px",
          fontSize: "14px",
          color: "var(--muted, #94a3b8)",
        }}
      >
        {countries.length === 0 ? (
          <p style={{ margin: 0 }}>
            Karte wird angezeigt sobald Länder hinzugefügt werden
          </p>
        ) : validCountriesCount === 0 ? (
          <p style={{ margin: 0 }}>
            Keine Koordinaten verfügbar. Füge latitude/longitude zu den Ländern
            hinzu.
          </p>
        ) : (
          <div>
            <p style={{ margin: "0 0 4px 0" }}>
              <strong>{validCountriesCount}</strong> von{" "}
              <strong>{countries.length}</strong> Ländern auf der Karte
            </p>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
              Klicke auf die roten Marker für Details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
