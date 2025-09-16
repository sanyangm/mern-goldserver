import React from "react";
import "./App.css";
import Countries from "./pages/Countries"; // <-- richtiger Pfad
 
export default function App() {
  return (
    <>
      <header className="hero">
        <div className="container">
          <h1>Goldreserven Verwaltung</h1>
          <p>Verwalte Länder und ihre Goldreserven</p>
        </div>
      </header>
 
      <main className="container">
        <section className="card">
          <h2>Länder &amp; Goldreserven Manager</h2>
          <div className="form-grid">
            <div className="full">
              <Countries />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
 