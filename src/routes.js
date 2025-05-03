const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const usersPath = path.join(__dirname, '..', 'users.json');
const load = () => JSON.parse(fs.readFileSync(usersPath));
const save = data => fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
const view = f => path.join(__dirname, 'views', f);

const auth = require('./middleware/auth');

module.exports = {
  auth,

  login: (req, res) => {
    const html = fs.readFileSync(view('login.html'), 'utf8').replace('{{ERROR}}', req.query.error ? 'Invalid credentials' : '');
    res.send(html);
  },
  register: (req, res) => {
    const html = fs.readFileSync(view('register.html'), 'utf8').replace('{{ERROR}}', req.query.error ? 'User exists' : '');
    res.send(html);
  },
  check_creds: (req, res) => {
    const { username, password } = req.body;
    console.log('[DEBUG] username:', username, '| password:', password);
  
    const user = load().find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      console.log('[DEBUG] Invalid credentials');
      return res.redirect('/login?error=1');
    }
  
    req.session.user = { username: user.username };
    res.redirect('/secret');
  },
  create_user: (req, res) => {
    const { username, password } = req.body;
    const users = load();
    if (users.find(u => u.username === username)) return res.redirect('/register?error=1');
    users.push({ username, password: bcrypt.hashSync(password, 10), secret: 'FLAG{user}', description: '' });
    save(users);
    req.session.user = { username };
    res.redirect('/secret');
  },
  secret: (req, res) => {
    const user = load().find(u => u.username === req.session.user.username);
    const html = fs.readFileSync(view('secret.html'), 'utf8')
      .replace('{{USERNAME}}', user.username)
      .replace('{{SECRET}}', user.secret);
    res.send(html);
  },
  profile: (req, res) => {
    const user = load().find(u => u.username === req.session.user.username);
    const html = fs.readFileSync(view('profile.html'), 'utf8')
      .replace('{{USERNAME}}', user.username)
      .replace('{{SECRET}}', user.secret)
      .replace('{{DESC}}', user.description || ''); // ⚠️ XSS possible ici
    res.send(html);
  },


  

  search: (req, res) => {
    const q = req.query.q || '';
    res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Search | Vulnerable Website</title>
    <link rel="stylesheet" href="/main.css" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f5f5f5;
        margin: 0;
        padding: 0;
      }
      .navbar {
        background-color: #222;
        color: white;
        padding: 10px;
        text-align: center;
      }
      .navbar a {
        color: #61dafb;
        margin: 0 15px;
        text-decoration: none;
      }
      .container {
        max-width: 600px;
        margin: 60px auto;
        padding: 30px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      input {
        width: 100%;
        padding: 8px;
        margin-top: 10px;
        box-sizing: border-box;
      }
      button {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .result {
        margin-top: 20px;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <div class="navbar">
      <a href="/login">Login</a>
      <a href="/register">Register</a>
      <a href="/secret">Secret</a>
      <a href="/profile">Profile</a>
      <a href="/search">Search</a>
      <a href="/logout">Logout</a>
    </div>
  
    <div class="container">
      <h2>Search</h2>
      <form method="GET" action="/search">
        <input name="q" placeholder="Search something..." />
        <button>Search</button>
      </form>
      <div class="result">
        <p>Results for: ${q}</p>
      </div>
    </div>
  </body>
  </html>`);
  },
  
  
  update_profile: (req, res) => {
    const { username, password, secret, description } = req.body;
    const users = load();
    const idx = users.findIndex(u => u.username === req.session.user.username);
    if (idx === -1) return res.redirect('/profile');
  
    if (username && username.trim() !== '') users[idx].username = username;
    if (password && password.trim() !== '') users[idx].password = bcrypt.hashSync(password, 10);
    if (secret && secret.trim() !== '') users[idx].secret = secret;
    if (typeof description !== 'undefined') users[idx].description = description;
  
    save(users);
    req.session.user.username = users[idx].username;
    res.redirect('/profile');
  }
  
  ,
  logout: (req, res) => req.session.destroy(() => res.redirect('/login'))
};
