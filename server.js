// Zeile 1: Zeug importieren
const express = require('express');  // Server framework
const jwt = require('jsonwebtoken'); // Macht Tokens
const cors = require('cors');        // Erlaubt Frontend Zugriff

// Zeile 2: App erstellen
const app = express();

// Zeile 3: Middleware aktivieren
app.use(cors());           // Frontend darf reden
app.use(express.json());   // Versteht JSON im Request

// Zeile 4: Login Endpunkt
app.post('/api/login', (req, res) => {
  // req.body enthält username + passwort vom Frontend
  const { email, password } = req.body;
  
  // Prüfen (hardcoded, später aus Datenbank)
  if (email === 'admin@admin' && password === 'admin') {
    // Token erstellen
    const token = jwt.sign(
      { email: email },  // Was im Token steckt
      'mein_geheimer_key', // Unterschrift
      { expiresIn: '2h' }  // Gültigkeit
    );
    
    // Zurückschicken
    res.json({ success: true, token: token });
  } else {
    res.status(401).json({ success: false });
  }
});

// Zeile 5: Geschützter Endpunkt (Test)
app.get('/api/geschuetzt', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Kein Token' });
  }
  
  const token = authHeader.split(' ')[1]; // "Bearer TOKEN" -> nur TOKEN
  
  try {
    const decoded = jwt.verify(token, 'mein_geheimer_key');
    res.json({ message: `Hallo ${decoded.name}, du bist eingeloggt!` });
  } catch (error) {
    res.status(403).json({ error: 'Token ungültig' });
  }
});

// Zeile 6: Server starten
app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});