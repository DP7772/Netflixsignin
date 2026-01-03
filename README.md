<div align="center">
  <img src="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.png" alt="Logo" width="80" height="80" />

  # 🎬 InternetFlox 
  
  **An End-to-End Full Stack Streaming Architecture**
  
  <p>
    <a href="https://internetfloxsign.netlify.app/">🔴 View Live Demo</a> •
    <a href="https://github.com/DP7772/Netflixsignin">📂 Browse Code</a> •
    <a href="https://linkedin.com/in/akash-maurya7/">👨‍💻 Contact Developer</a>
  </p>

  ![Netlify Status](https://api.netlify.com/api/v1/badges/74b12f23-fb79-4b05-9113-4dd17a9f0e6d/deploy-status)
  ![License](https://img.shields.io/badge/License-MIT-blue.svg)
  ![Status](https://img.shields.io/badge/Status-Live-success)
  ![Focus](https://img.shields.io/badge/Focus-Real%20Time%20Data-orange)

</div>

---

## 📝 About The Project

**InternetFlox** is not just a UI clone. It is a fully functional, data-driven web application that simulates a real-world streaming platform's architecture. 

Unlike static templates, every interaction here—**Sign Up, Login, Password Reset, Account Deletion**—triggers **real-time backend operations** via serverless functions and a secure PostgreSQL database.

It also features an **Integrated AI Agent** powered by n8n to assist users contextually.

---

## ✨ Key Features

### 🔐 **Secure Authentication System**
- **Real-Time OTP Verification:** Uses **Nodemailer** to send 6-digit verification codes to Gmail.
- **Secure Storage:** Passwords are hashed and salted (bcrypt) before being stored in the database.
- **Session Handling:** Secure login/logout flows with user persistence.

### 🗄️ **Robust Backend & Database**
- **Serverless Architecture:** Logic runs on **Netlify Functions** (Node.js), ensuring hidden API keys and secure transactions.
- **PostgreSQL (Neon DB):** Persistent storage for Users, OTPs, and Watchlists.
- **CRUD Operations:** Users can Create accounts, Read movie data, Update profiles/passwords, and Delete accounts permanently.

### 🤖 **AI & Automation**
- **Custom AI Chatbot:** Built using **n8n workflows**.
- **Context Aware:** The bot understands the platform's features (e.g., "How to sign out?", "Who is the developer?").
- **Security Guardrails:** Trained to refuse requests for internal code or sensitive data.

### 🎨 **Advanced UI/UX**
- **Fully Responsive:** Optimized for Mobile, Tablet, and Desktop.
- **Multi-Language Support:** Instant translation for 7+ languages.
- **Dynamic Content:** Fetches live movie data (Trending, Top Rated) via **TMDB API**.
- **Community Feedback:** A dedicated section showcasing real reviews from industry peers.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Glassmorphism),  JavaScript |
| **Backend** | Netlify Serverless Functions |
| **Database** | Neon DB (PostgreSQL) |
| **AI/Automation** | n8n (Workflow Automation) |
| **Third-Party APIs** | TMDB (Movie Data), Nodemailer (Email Service) |
| **Dev Tools** | VS Code, GitHub |

---

## 📸 Screenshots

| Landing Page | Real-Time Dashboard |
| :---: | :---: |
| ![Landing](https://raw.githubusercontent.com/DP7772/Netflixsignin/main/LANDING.png) | ![Dashboard](https://raw.githubusercontent.com/DP7772/Netflixsignin/main/DASHBOARD.png) |

| AI Chatbot | Database (Neon) |
| :---: | :---: |
| ![Chatbot](https://raw.githubusercontent.com/DP7772/Netflixsignin/main/CHATBOAT.png) | ![DB](https://raw.githubusercontent.com/DP7772/Netflixsignin/main/DB.png) |

---
