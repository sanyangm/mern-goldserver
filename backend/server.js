// server.js - Für MongoDB Atlas (Cloud)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS für alle Frontend-Ports
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
      "https://github.com/sanyangm/mern-goldserver",
      "https://mern-goldserver.vercel.app", // Vercel-Frontend erlauben
    ],
    credentials: true,
  })
);

app.use(express.json());

// MONGODB ATLAS VERBINDUNG
const connectDB = async () => {
  try {
    const mongoURI =
      "mongodb+srv://Lamin:DanIsaFA2@cluster0.t2obix7.mongodb.net/goldreserven";

    await mongoose.connect(mongoURI);
    console.log("MongoDB Atlas verbunden!");
    console.log("Datenbank: goldreserven");
  } catch (error) {
    console.error("MongoDB Atlas Fehler:", error.message);
    console.log("Prüfe Username/Password und Internet-Verbindung");
    process.exit(1);
  }
};

// COUNTRY SCHEMA - MIT KOORDINATEN FÜR KARTE
const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capital: {
      type: String,
      required: true,
    },
    goldReserves: {
      type: Number,
      required: true,
      min: 0,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
  }
);

const Country = mongoose.model("Country", CountrySchema);

// API ROUTEN

// GET - Alle Länder
app.get("/api/countries", async (req, res) => {
  try {
    console.log("Frontend fragt: Alle Länder");

    const countries = await Country.find().sort({ goldReserves: -1 });
    console.log(`Gefunden: ${countries.length} Länder in Atlas DB`);

    res.json(countries);
  } catch (error) {
    console.error("Fehler beim Lesen:", error);
    res.status(500).json({ message: "Fehler beim Laden" });
  }
});

// POST - Land hinzufügen
app.post("/api/countries", async (req, res) => {
  try {
    console.log("Frontend: Neues Land speichern");
    console.log("Daten:", req.body);

    const country = new Country(req.body);
    const savedCountry = await country.save();

    console.log("In Atlas gespeichert:", savedCountry.name);

    res.status(201).json(savedCountry);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);

    if (error.code === 11000) {
      res.status(400).json({ message: "Land existiert bereits!" });
    } else if (error.name === "ValidationError") {
      res.status(400).json({ message: "Ungültige Daten! Prüfe alle Felder." });
    } else {
      res.status(500).json({ message: "Server Fehler" });
    }
  }
});

// DELETE - Land löschen
app.delete("/api/countries/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Frontend: Lösche Land ID:", id);

    const deletedCountry = await Country.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res.status(404).json({ message: "Land nicht gefunden" });
    }

    console.log("Aus Atlas gelöscht:", deletedCountry.name);

    res.json({
      message: "Land erfolgreich gelöscht",
      deletedCountry: deletedCountry.name,
    });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    res.status(500).json({ message: "Fehler beim Löschen" });
  }
});

// TEST ROUTE
app.get("/", async (req, res) => {
  try {
    const count = await Country.countDocuments();
    const countries = await Country.find().limit(3);

    res.json({
      message: "Goldreserven API mit MongoDB Atlas!",
      länderInDB: count,
      datenbank: "MongoDB Atlas (Cloud)",
      beispielLänder: countries.map((c) => c.name),
    });
  } catch (error) {
    res.json({
      message: "API läuft, aber MongoDB Problem",
      fehler: error.message,
    });
  }
});

// SERVER STARTEN
const startServer = async () => {
  await connectDB();

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log("Server läuft auf http://localhost:5000");
    console.log("Verbunden mit MongoDB Atlas");
  });
};

startServer();
