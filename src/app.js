const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration améliorée pour les vues et les assets
app.use(express.static(path.join(__dirname, 'public'))); // Chemin corrigé
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration de session corrigée
app.use(session({
  secret: process.env.SESSION_SECRET || 'session_secret',
  resave: false,
  saveUninitialized: false, // Changé à false
  cookie: {
    httpOnly: process.env.HTTP_ONLY === 'true',
    sameSite: process.env.SAME_SITE || 'Lax', // 'None' ne fonctionne qu'en HTTPS
    secure: false, // Désactivé pour le développement local
    maxAge: 1000 * 60 * 60
  }
}));

// Middleware de vérification de session
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/search', routes.search);
app.get('/login', routes.login);
app.post('/login', routes.check_creds);
app.get('/register', routes.register);
app.post('/register', routes.create_user);
app.get('/secret', routes.auth, routes.secret);
app.get('/profile', routes.auth, routes.profile);
app.post('/profile', routes.auth, routes.update_profile);
app.get('/logout', routes.logout);

app.get('/', (req, res) => res.redirect('/login'));
app.use((_, res) => res.status(404).send('404 Not Found'));
app.listen(PORT, () => console.log(`[CTF] Listening at http://localhost:${PORT}`));
