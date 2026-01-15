# UnitTrack 🏠

A mobile-friendly web application that simplifies communication between tenants and property owners for maintenance reporting.

UnitTrack intentionally uses unit-based identification instead of tenant accounts to reduce administrative burden, improve accessibility for low-tech users, and support high-tenant turnover environments common in township housing.

![UnitTrack](https://img.shields.io/badge/Status-In%20Development-yellow)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-JavaScript%20%7C%20Node.js%20%7C%20MongoDB-blue)

## 📖 About

UnitTrack allows tenants to instantly report maintenance issues using a unique QR code and room/unit code system. Property owners can track, manage, and resolve these reports through a centralized dashboard.

**Tagline:** _"Track every fix, right from your unit."_

## ✨ Features

### For Tenants

- 📱 Mobile-first responsive design
- 🔐 Simple room code authentication (no passwords needed)
- 📸 Photo/video upload for clear issue documentation
- 🚨 Urgency levels for prioritization
- 📬 Automatic status notifications

### For Property Owners

- 📊 Centralized dashboard for all maintenance requests
- 🏷️ Categorization and status tracking (Submitted → In Progress → Resolved)
- 📈 Historical record of all maintenance activity

## 🛠️ Tech Stack

**Frontend:**

- HTML5, CSS3, Bootstrap 5
- Vanilla JavaScript
- Responsive mobile-first design

**Backend:** (Planned)

- Node.js + Express.js
- MongoDB + Mongoose
- Multer (file uploads)
- Nodemailer (notifications)

**Hosting:** (Planned)

- Frontend: Netlify/Vercel
- Backend: Render/Railway
- Database: MongoDB Atlas

## 🎯 MVP Goals

- Tenants can submit maintenance or complaint forms.
- Landlords can log in to view reports.
- All reports stored locally (before backend setup).

## 📁 Folder Structure

unittrack/
├── index.html
├── tenant/
│ ├── login.html
│ ├── report.html
│ └── success.html
├── owner/
│ ├── login.html
│ └── dashboard.html
└── assets/
├── css/
├── js/
└── images/

## ⚙️ Setup Instructions

1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/unittrack.git
   ```
