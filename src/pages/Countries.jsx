// pages/Countries.jsx
// Hauptseite: lädt Länder, zeigt Status, Formular, Liste und kleine Statistik
import MapComponent from "../components/MapComponent";
import { useState, useEffect } from "react";
import CountryForm from "../components/CountryForm";
import { useMemo } from "react";

const API_BASE =
  import.meta?.env?.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function Countries() {
  const [countries, setCountries] = useState([]); // Liste aller Länder
  const [loading, setLoading] = useState(false); // Ladeanzeige

  useEffect(() => {
    loadCountriesFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Länder vom Backend laden
  const loadCountriesFromBackend = async () => {
    console.log("Lade Länder vom Backend...");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/countries`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Länder erhalten:", data);
      setCountries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      alert(
        `Backend Fehler: ${error.message}. Läuft das Backend unter ${API_BASE}?`
      );
    } finally {
      setLoading(false);
    }
  };

  // Neues Land hinzufügen
  const addCountry = async (newCountryData) => {
    console.log("Füge Land hinzu:", newCountryData);
    try {
      const response = await fetch(`${API_BASE}/api/countries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCountryData),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || `HTTP ${response.status}`);
      }
      const savedCountry = await response.json();
      console.log("Backend antwort:", savedCountry);
      setCountries((prev) => [...prev, savedCountry]); // lokal ergänzen
      alert(`${savedCountry.name} wurde hinzugefügt!`);
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
      alert("Fehler beim Hinzufügen! Läuft das Backend?");
    }
  };

  // Land löschen
  const deleteCountry = async (index) => {
    const country = countries[index];
    if (!country) return;
    console.log("Lösche:", country.name);

    if (!window.confirm(`${country.name} wirklich löschen?`)) return;

    try {
      const response = await fetch(`${API_BASE}/api/countries/${country._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || `HTTP ${response.status}`);
      }
      setCountries((prev) => prev.filter((_, i) => i !== index));
      alert(`${country.name} wurde gelöscht!`);
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Fehler beim Löschen!");
    }
  };

  // Summe der Goldreserven berechnen (mit useMemo)
  const totalGold = useMemo(() => {
    return countries
      .reduce((sum, c) => sum + (Number(c.goldReserves) || 0), 0)
      .toFixed(1);
  }, [countries]);

  return (
    <div>
      {/* Status-Banner */}
      <div className="alert success">
        {loading ? (
          <p>Lade Daten vom Backend...</p>
        ) : countries.length > 0 ? (
          <p>
            Backend verbunden! <strong>{countries.length}</strong>{" "}
            {countries.length === 1 ? "Land" : "Länder"} geladen
          </p>
        ) : (
          <div>
            <p>Keine Länder gefunden</p>
            <p style={{ fontSize: 14, opacity: 0.8 }}>
              Backend starten: <code>cd backend && npm run dev</code>
            </p>
          </div>
        )}
      </div>

      {/* Formular (eigene Card für schöne Abgrenzung) */}
      <section className="card">
        <h3 style={{ marginTop: 0 }}>Neues Land hinzufügen</h3>
        <div className="form-grid">
          {/* Falls dein CountryForm selbst mehrspaltig ist, entferne die umgebende Grid-Klasse */}
          <div className="full">
            <CountryForm onSave={addCountry} />
          </div>
        </div>
      </section>

      {/* Karte (Platzhalter) */}
      <section className="card" style={{ opacity: 0.9 }}>
        <h3 style={{ marginTop: 0 }}>🗺️ Karte</h3>
        <p style={{ marginTop: 8, color: "var(--muted)" }}>
          MapLibre wird konfiguriert – Platzhalterfläche.
          <MapComponent countries={countries} height={260} />
        </p>
        <div
          style={{
            height: 260,
            border: "1px dashed var(--border)",
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: "#121725",
          }}
        >
          <span style={{ opacity: 0.7 }}>Kartenfläche</span>
        </div>
      </section>

      {/* Liste aller Länder */}
      <section className="card">
        <h3 style={{ marginTop: 0 }}>Alle Länder ({countries.length})</h3>

        {countries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 32,
              border: "1px dashed var(--border)",
              borderRadius: 12,
              background: "#121725",
              color: "var(--muted)",
            }}
          >
            Noch keine Länder vorhanden. Füge dein erstes Land oben hinzu!
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {countries.map((country, index) => (
              <article
                key={country._id || `${country.name}-${index}`}
                className="card"
                style={{ margin: 0, padding: 16 }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: "0 0 6px 0" }}>{country.name}</h4>
                    <p style={{ margin: "4px 0", color: "var(--muted)" }}>
                      <strong>Hauptstadt:</strong> {country.capital || "—"}
                    </p>
                    <p
                      style={{
                        margin: "4px 0",
                        fontWeight: 700,
                      }}
                    >
                      <strong>Goldreserven:</strong>{" "}
                      {Number(country.goldReserves || 0)} Tonnen
                    </p>
                    {country.latitude != null && country.longitude != null && (
                      <p style={{ margin: "4px 0", opacity: 0.8 }}>
                        <strong>Koordinaten:</strong>{" "}
                        {Number(country.latitude).toFixed(2)},{" "}
                        {Number(country.longitude).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Löschen */}
                  <button
                    onClick={() => deleteCountry(index)}
                    title="Land löschen"
                    style={{
                      border: "1px solid #7f1d1d",
                      background: "linear-gradient(180deg, #ef4444, #b91c1c)",
                      color: "#fff",
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Löschen
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Statistik */}
      {countries.length > 0 && (
        <section className="card" style={{ textAlign: "center" }}>
          <h3 style={{ marginTop: 0 }}>Statistiken</h3>
          <p style={{ marginTop: 8 }}>
            <strong>Gesamte Goldreserven:</strong> {totalGold} Tonnen
          </p>
        </section>
      )}
    </div>
  );
}
