// components/CountryForm.jsx
// Das ist ein Formular um neue Länder hinzuzufügen

import { useState } from 'react';

const CountryForm = ({ onSave }) => {
  // useState = speichert was der User eingibt
  const [name, setName] = useState('');           // Land-Name
  const [capital, setCapital] = useState('');     // Hauptstadt  
  const [goldReserves, setGoldReserves] = useState(''); // Goldreserven
  const [latitude, setLatitude] = useState('');   // Breite für Karte
  const [longitude, setLongitude] = useState(''); // Länge für Karte
  const [coordsFound, setCoordsFound] = useState(false); // Koordinaten gefunden?

  // KOORDINATEN DATENBANK - Häufige Länder
  const countryCoordinates = {
    'deutschland': { lat: 51.1657, lng: 10.4515, capital: 'Berlin' },
    'germany': { lat: 51.1657, lng: 10.4515, capital: 'Berlin' },
    'schweiz': { lat: 46.8182, lng: 8.2275, capital: 'Bern' },
    'switzerland': { lat: 46.8182, lng: 8.2275, capital: 'Bern' },
    'österreich': { lat: 47.5162, lng: 14.5501, capital: 'Wien' },
    'austria': { lat: 47.5162, lng: 14.5501, capital: 'Wien' },
    'frankreich': { lat: 46.6034, lng: 1.8883, capital: 'Paris' },
    'france': { lat: 46.6034, lng: 1.8883, capital: 'Paris' },
    'italien': { lat: 41.8719, lng: 12.5674, capital: 'Rom' },
    'italy': { lat: 41.8719, lng: 12.5674, capital: 'Rom' },
    'spanien': { lat: 40.4637, lng: -3.7492, capital: 'Madrid' },
    'spain': { lat: 40.4637, lng: -3.7492, capital: 'Madrid' },
    'niederlande': { lat: 52.1326, lng: 5.2913, capital: 'Amsterdam' },
    'netherlands': { lat: 52.1326, lng: 5.2913, capital: 'Amsterdam' },
    'belgien': { lat: 50.5039, lng: 4.4699, capital: 'Brüssel' },
    'belgium': { lat: 50.5039, lng: 4.4699, capital: 'Brüssel' },
    'polen': { lat: 51.9194, lng: 19.1451, capital: 'Warschau' },
    'poland': { lat: 51.9194, lng: 19.1451, capital: 'Warschau' },
    'tschechien': { lat: 49.8175, lng: 15.4730, capital: 'Prag' },
    'czech republic': { lat: 49.8175, lng: 15.4730, capital: 'Prag' },
    'ungarn': { lat: 47.1625, lng: 19.5033, capital: 'Budapest' },
    'hungary': { lat: 47.1625, lng: 19.5033, capital: 'Budapest' },
    'dänemark': { lat: 56.2639, lng: 9.5018, capital: 'Kopenhagen' },
    'denmark': { lat: 56.2639, lng: 9.5018, capital: 'Kopenhagen' },
    'schweden': { lat: 60.1282, lng: 18.6435, capital: 'Stockholm' },
    'sweden': { lat: 60.1282, lng: 18.6435, capital: 'Stockholm' },
    'norwegen': { lat: 60.4720, lng: 8.4689, capital: 'Oslo' },
    'norway': { lat: 60.4720, lng: 8.4689, capital: 'Oslo' },
    'finnland': { lat: 61.9241, lng: 25.7482, capital: 'Helsinki' },
    'finland': { lat: 61.9241, lng: 25.7482, capital: 'Helsinki' },
    'grossbritannien': { lat: 55.3781, lng: -3.4360, capital: 'London' },
    'united kingdom': { lat: 55.3781, lng: -3.4360, capital: 'London' },
    'england': { lat: 55.3781, lng: -3.4360, capital: 'London' },
    'usa': { lat: 37.0902, lng: -95.7129, capital: 'Washington D.C.' },
    'united states': { lat: 37.0902, lng: -95.7129, capital: 'Washington D.C.' },
    'kanada': { lat: 56.1304, lng: -106.3468, capital: 'Ottawa' },
    'canada': { lat: 56.1304, lng: -106.3468, capital: 'Ottawa' },
    'russland': { lat: 61.5240, lng: 105.3188, capital: 'Moskau' },
    'russia': { lat: 61.5240, lng: 105.3188, capital: 'Moskau' },
    'china': { lat: 35.8617, lng: 104.1954, capital: 'Peking' },
    'japan': { lat: 36.2048, lng: 138.2529, capital: 'Tokio' },
    'indien': { lat: 20.5937, lng: 78.9629, capital: 'Neu-Delhi' },
    'india': { lat: 20.5937, lng: 78.9629, capital: 'Neu-Delhi' },
    'brasilien': { lat: -14.2350, lng: -51.9253, capital: 'Brasília' },
    'brazil': { lat: -14.2350, lng: -51.9253, capital: 'Brasília' },
    'australien': { lat: -25.2744, lng: 133.7751, capital: 'Canberra' },
    'australia': { lat: -25.2744, lng: 133.7751, capital: 'Canberra' },
    'gambia': { lat: 13.4432, lng: -15.3101, capital: 'Banjul' },
    'senegal': { lat: 14.4974, lng: -14.4524, capital: 'Dakar' },
    // Weitere Länder können hier hinzugefügt werden
    'ägypten': { lat: 26.8206, lng: 30.8025, capital: 'Kairo' },
    'ethiopia': { lat: 9.1450, lng: 40.4897, capital: 'Addis Abeba' }
  };

  // Wird aufgerufen wenn User Land-Name eingibt
  const handleNameChange = (e) => {
    const countryName = e.target.value;
    setName(countryName);
    
    // Automatisch Koordinaten suchen
    if (countryName.length > 2) { // Erst ab 3 Buchstaben suchen
      findCoordinates(countryName);
    }
  };

  // Koordinaten für Land finden
  const findCoordinates = (countryName) => {
    const searchName = countryName.toLowerCase().trim();
    const countryData = countryCoordinates[searchName];
    
    if (countryData) {
      // Koordinaten gefunden - automatisch ausfüllen
      setLatitude(countryData.lat);
      setLongitude(countryData.lng);
      
      // Hauptstadt auch vorschlagen (wenn noch leer)
      if (!capital) {
        setCapital(countryData.capital);
      }
      
      setCoordsFound(true);
      console.log(`Koordinaten gefunden für ${countryName}:`, countryData);
    } else {
      setCoordsFound(false);
    }
  };

  // Wird aufgerufen wenn User auf "Hinzufügen" klickt
  const handleSubmit = (e) => {
    e.preventDefault(); // Seite nicht neu laden
    
    // Alle Eingaben in ein Objekt packen
    const newCountry = {
      name: name,
      capital: capital,
      goldReserves: parseFloat(goldReserves), // String zu Zahl
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    // An Parent-Komponente senden (Countries.jsx)
    onSave(newCountry);

    // Alle Felder wieder leeren
    setName('');
    setCapital('');
    setGoldReserves('');
    setLatitude('');
    setLongitude('');
    setCoordsFound(false);
  };

  return (
    <div style={{ 
      border: '2px solid #ddd', 
      padding: '20px', 
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      marginBottom: '20px'
    }}>
      <h2>Neues Land hinzufügen</h2>
      
      {/* HTML Form */}
      <form onSubmit={handleSubmit}>
        
        {/* Land-Name Eingabe */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Land-Name:</label>
          <input 
            type="text"
            value={name}                           // Was aktuell drinsteht
            onChange={handleNameChange}           // GEÄNDERT: Neue Funktion
            placeholder="z.B. Deutschland (Koordinaten werden automatisch gefunden)"
            required                               // Muss ausgefüllt werden
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px',
              border: `2px solid ${coordsFound ? '#28a745' : '#ccc'}`, // Grün wenn gefunden
              borderRadius: '5px'
            }}
          />
          
          {/* Status anzeigen */}
          {coordsFound && (
            <p style={{ color: '#28a745', fontSize: '12px', margin: '5px 0 0 0' }}>
              ✓ Koordinaten automatisch gefunden!
            </p>
          )}
          {name.length > 2 && !coordsFound && (
            <p style={{ color: '#856404', fontSize: '12px', margin: '5px 0 0 0' }}>
              ⚠ Koordinaten nicht gefunden - bitte manuell eingeben
            </p>
          )}
        </div>

        {/* Hauptstadt Eingabe */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Hauptstadt:</label>
          <input 
            type="text"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="z.B. Berlin"
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
        </div>

        {/* Goldreserven Eingabe */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Goldreserven (Tonnen):</label>
          <input 
            type="number"                          // Nur Zahlen erlaubt
            value={goldReserves}
            onChange={(e) => setGoldReserves(e.target.value)}
            placeholder="z.B. 3362.4"
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
        </div>

        {/* Koordinaten - AUTOMATISCH oder MANUELL */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '10px 0 5px 0' }}>Koordinaten für Karte:</h4>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>
            {coordsFound ? 
              'Automatisch gefunden! Du kannst sie ändern falls nötig.' : 
              'Werden automatisch gesucht oder manuell eingeben.'
            }
          </p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Latitude */}
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Latitude:</label>
              <input 
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="z.B. 51.1657"
                step="any"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: `2px solid ${coordsFound ? '#28a745' : '#ccc'}`,
                  borderRadius: '5px',
                  backgroundColor: coordsFound ? '#f8fff8' : 'white'
                }}
              />
            </div>
            
            {/* Longitude */}
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Longitude:</label>
              <input 
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="z.B. 10.4515"
                step="any"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginTop: '5px',
                  border: `2px solid ${coordsFound ? '#28a745' : '#ccc'}`,
                  borderRadius: '5px',
                  backgroundColor: coordsFound ? '#f8fff8' : 'white'
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#28a745',   // Grün
            color: 'white', 
            padding: '12px 25px', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Land hinzufügen
        </button>
      </form>
    </div>
  );
};

// Exportieren damit andere Dateien es nutzen können
export default CountryForm;