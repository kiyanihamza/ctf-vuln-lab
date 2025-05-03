# CTF Vulnerable Lab

This project is a lightweight, intentionally vulnerable web application built with Node.js and Express.js.  
It is designed for training and demonstrating common web vulnerabilities like **XSS**, **CSRF**, and **session misuse**.

---

## 🚀 Features

- ✅ User login & registration system  
- ✅ User profile editing (username, password, secret, description)  
- ✅ Stored & Reflected XSS vulnerabilities  
- ✅ Manual CSRF scenarios  
- ✅ Express-session with cookie options  
- ✅ JSON-based "database" for simplicity  
- ✅ No need for Apache, Nginx, or Tomcat

---

## 🛠 Installation

```bash
git clone https://github.com/<your-username>/ctf-vuln-lab.git
cd ctf-vuln-lab
npm install
cp .env.example .env
npm start

## 🔥 Vulnerable Pages

- [`/profile`](http://localhost:3000/profile) → **Stored XSS** via `description` field  
- [`/search?q=...`](http://localhost:3000/search?q=%3Cscript%3Ealert(1)%3C/script%3E) → **Reflected XSS** via query param  
- [`/secret`](http://localhost:3000/secret) → **Private flag page**
