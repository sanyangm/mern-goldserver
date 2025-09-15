// pages/Countries.jsx  
// Das ist die Hauptseite wo alles zusammenkommt

import { useState, useEffect } from 'react';
import CountryForm from '../components/CountryForm';

const Countries = () => {
  // useState = Variable die sich ändern kann
  const [countries, setCountries] = useState([]);  // Liste aller Länder
  const [loading, setLoading] = useState(false);   // Zeigt "Lädt..." an

  // useEffect = läuft automatisch wenn Seite startet
  useEffect(() => {
    loadCountriesFromBackend(); // Länder vom Backend holen
  }, []);

  // FUNKTION: Länder vom Backend laden
  const loadCountriesFromBackend = async () => {
    console.log('Lade Länder vom Backend...');
    setLoading(true); // Zeige "Lädt..." an
    
    try {
      // fetch = spricht mit Backend
      const response = await fetch('http://localhost:5000/api/countries');
      const data = await response.json(); // JSON zu JavaScript Object
      
      console.log('Länder erhalten:', data);
      setCountries(data); // Länder in State speichern
    } catch (error) {
      console.error('Fehler beim Laden:', error);
      alert('Backend nicht erreichbar! Ist es gestartet?');
    }
    
    setLoading(false); // "Lädt..." ausblenden
  };

  // FUNKTION: Neues Land hinzufügen
  const addCountry = async (newCountryData) => {
    console.log('Füge Land hinzu:', newCountryData);
    
    try {
      // POST = an Backend senden
      const response = await fetch('http://localhost:5000/api/countries', {
        method: 'POST',                    // POST = hinzufügen
        headers: {
          'Content-Type': 'application/json' // Sende JSON
        },
        body: JSON.stringify(newCountryData) // Object zu JSON String
      });
      
      const savedCountry = await response.json();
      console.log('Backend antwort:', savedCountry);
      
      // Zur lokalen Liste hinzufügen (ohne neu laden)
      setCountries([...countries, savedCountry]);
      
      alert(`${savedCountry.name} wurde hinzugefügt!`);
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
      alert('Fehler! Backend läuft?');
    }
  };

  // FUNKTION: Land löschen
  const deleteCountry = async (index) => {
    const country = countries[index];
    console.log('Lösche:', country.name);
    
    // Sicherheitsabfrage
    if (!window.confirm(`${country.name} wirklich löschen?`)) {
      return; // Abbrechen
    }
    
    try {
      // DELETE = vom Backend löschen
      const response = await fetch(`http://localhost:5000/api/countries/${country._id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Aus lokaler Liste entfernen
        setCountries(countries.filter((_, i) => i !== index));
        alert(`${country.name} wurde gelöscht!`);
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen!');
    }
  };

  // Das wird auf der Seite angezeigt
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Überschrift */}
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        Länder & Goldreserven Manager
      </h1>
      
      {/* Status anzeigen */}
      <div style={{ 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: countries.length > 0 ? '#d4edda' : '#fff3cd',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        {loading ? (
          <p>Lade Daten vom Backend...</p>
        ) : countries.length > 0 ? (
          <p>Backend verbunden! {countries.length} Länder geladen</p>
        ) : (
          <div>
            <p>Keine Länder gefunden</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Backend starten: <code>cd backend && node server.js</code>
            </p>
          </div>
        )}
      </div>
      
      {/* Formular zum Hinzufügen */}
      <CountryForm onSave={addCountry} />
      
      {/* Liste aller Länder */}
      <div>
        <h2>Alle Länder ({countries.length})</h2>
        
        {/* Wenn keine Länder da sind */}
        {countries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px dashed #ccc'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              Noch keine Länder vorhanden
            </p>
            <p>Füge dein erstes Land oben hinzu!</p>
          </div>
        ) : (
          // Wenn Länder da sind - alle anzeigen
          countries.map((country, index) => (
            <div 
              key={country._id || index}  // Eindeutige ID für React
              style={{
                border: '2px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                margin: '15px 0',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              {/* Land-Info und Löschen-Button */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                
                {/* Land-Informationen */}
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {country.name}
                  </h3>
                  
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Hauptstadt:</strong> {country.capital}
                  </p>
                  
                  <p style={{ margin: '5px 0', color: '#ff6b35', fontWeight: 'bold' }}>
                    <strong>Goldreserven:</strong> {country.goldReserves} Tonnen
                  </p>
                  
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#888' }}>
                    <strong>Koordinaten:</strong> {country.latitude?.toFixed(2)}, {country.longitude?.toFixed(2)}
                  </p>
                </div>
                
                {/* Löschen Button */}
                <button 
                  onClick={() => deleteCountry(index)}
                  style={{
                    backgroundColor: '#dc3545',  // Rot
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Einfache Statistik */}
      {countries.length > 0 && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e8f4f8',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>Statistiken</h3>
          <p>
            <strong>Gesamte Goldreserven:</strong> {' '}
            {countries.reduce((sum, country) => sum + (country.goldReserves || 0), 0).toFixed(1)} Tonnen
          </p>
        </div>
      )}
    </div>
  );
};

// Exportieren
export default Countries;