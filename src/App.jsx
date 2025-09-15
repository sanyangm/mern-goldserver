
// App.jsx - Hauptdatei der React App

import Countries from './pages/Countries'  // Unsere Countries Seite
import './App.css'

function App() {
  // Das wird angezeigt wenn die App startet
  return (
    <div>
      {/* Einfacher Header */}
      <header style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>Goldreserven Verwaltung</h1>
        <p>Verwalte Länder und ihre Goldreserven</p>
      </header>

      {/* Hauptinhalt */}
      <main>
        <Countries />  {/* Zeigt die Countries Seite an */}
      </main>

      {/* Einfacher Footer */}
      <footer style={{ 
        backgroundColor: '#34495e', 
        color: 'white', 
        padding: '15px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p>MERN Stack Projekt - Goldreserven App</p>
      </footer>
    </div>
  )
}

// Exportieren damit main.jsx es laden kann
export default App