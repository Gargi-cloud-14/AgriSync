# 🌾 AgriSync

### From Farm to Market. Connected. Smart. Together.

**AgriSync** is a community-focused digital agricultural supply-chain platform that connects **Farmers, Storage Providers, Transporters, and Buyers** through a single ecosystem.

The platform is designed to improve visibility, coordination, monitoring, and traceability across the journey of agricultural produce — from harvest to market.

---

## 🔄 How It Works

AgriSync connects the major participants involved in the agricultural supply chain:

**🌾 Farmer → 📦 Storage → 🌡️ Monitoring → 🚚 Transport → 🔗 Traceability → 🏪 Buyer**

### 1. 🌾 Farmers

Farmers can register their produce and explore suitable storage and transportation options.

### 2. 📦 Storage Providers

Storage providers can manage available capacity and monitor environmental conditions such as temperature and humidity.

### 3. 🚚 Transporters

Transporters can manage delivery requests, view routes, and support efficient movement of agricultural produce.

### 4. 🏪 Buyers

Buyers can discover available produce and verify important batch information through supply-chain traceability and QR verification.

---

## 🎯 Key Features

* **🌾 Farmer Management**
  Add, update, and manage agricultural produce listings.

* **📦 Storage Management**
  View storage capacity and monitor environmental conditions.

* **🚚 Smart Logistics**
  Connect harvested produce with transportation options and support efficient route planning.

* **🌦️ Weather Intelligence**
  Provide weather information to support safer and more timely transportation planning.

* **🌡️ IoT Monitoring**
  Monitor storage temperature and humidity using connected sensors.

* **🔗 Supply-Chain Traceability**
  Track important events associated with a produce batch across different stages of its journey.

* **📱 QR Verification**
  Enable users to scan and verify important batch details.

* **👥 Role-Based Platform**
  Provide dedicated platform experiences for Farmers, Storage Providers, Transporters, and Buyers.

---

## 💡 Problem We Aim to Address

Agricultural supply chains often involve multiple participants and disconnected processes. This can create challenges such as:

* Limited visibility into available storage.
* Difficulty coordinating transportation with harvest schedules.
* Weather-related risks during transportation.
* Limited visibility across different supply-chain stages.
* Difficulty verifying the journey of agricultural produce.

### Our Approach

**AgriSync** brings these participants and processes together within a single digital ecosystem.

The platform is designed to support:

**Better Coordination → Greater Visibility → Smarter Decisions → Transparent Supply Chains**

AgriSync focuses on building a connected infrastructure where farmers, logistics providers, storage facilities, and buyers can interact through a common platform.

---

## 🏗️ Platform Architecture

AgriSync follows a modular architecture so that different team members can independently develop and integrate platform modules.

```text
                    ┌─────────────────┐
                    │     FARMER      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    PRODUCE      │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
      ┌───────────────┐             ┌────────────────┐
      │    STORAGE    │             │  TRANSPORT     │
      │  + IoT Data   │             │  + Logistics   │
      └───────┬───────┘             └───────┬────────┘
              │                             │
              └──────────────┬──────────────┘
                             ▼
                    ┌─────────────────┐
                    │  TRACEABILITY   │
                    │    + QR         │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      BUYER      │
                    └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* Recharts
* Lucide React

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### APIs & Integration

* REST APIs
* Weather API integration
* IoT sensor integration
* Future Maps integration
* Future blockchain/traceability integration

### Development Tools

* Git
* GitHub
* GitHub Projects
* Postman
* VS Code

---

## 📁 Project Structure

The project follows a modular frontend architecture:

```text
src/
├── components/
├── pages/
├── layouts/
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── produceService.js
│   ├── storageService.js
│   ├── transportService.js
│   ├── weatherService.js
│   ├── sensorService.js
│   └── traceabilityService.js
│
├── data/
│   └── demoData.js
│
├── App.jsx
└── main.jsx
```

The service layer keeps API and feature-specific logic separate from UI components, making the platform easier to extend as backend integrations are added.

---

## 👥 Team Module Ownership

AgriSync is being developed using clear module boundaries to support parallel development.

| Member      | Responsibility                    |
| ----------- | --------------------------------- |
| 👤 Member 1 | Transport & Maps                  |
| 👤 Member 2 | Weather & Prediction              |
| 👤 Member 3 | Backend, MongoDB & Cloud          |
| 👤 Member 4 | Landing Page & UI/UX              |
| 👤 Member 5 | Blockchain, Traceability & QR     |
| 👤 Member 6 | Dashboards & Frontend Integration |

This modular approach helps reduce cross-module dependency and makes future integration easier.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Gargi-cloud-14/AgriSync.git
cd AgriSync
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`.

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Do not hardcode API URLs inside React components.

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will run using the Vite development server.

---

## 🤝 Contribution Guidelines

We use a feature-branch and pull-request workflow.

### Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### Make your changes

Follow the existing project structure and avoid modifying unrelated modules.

### Commit your changes

```bash
git add .
git commit -m "Add descriptive commit message"
```

### Push your branch

```bash
git push origin feature/your-feature-name
```

### Open a Pull Request

Create a Pull Request for review before merging into `main`.

> **Direct pushes to `main` should be avoided. All major changes should go through Pull Request review.**

---

## 🔐 Development Principles

While contributing to AgriSync:

* Keep components modular and reusable.
* Follow the existing architecture.
* Avoid unnecessary dependencies.
* Keep API calls inside the service layer.
* Keep demonstration data inside `demoData.js`.
* Never expose secrets or API keys in frontend code.
* Avoid hardcoded backend URLs.
* Maintain responsive design.
* Follow accessibility best practices.
* Avoid breaking existing routes or modules.
* Coordinate with the responsible team member before changing shared architecture.

---

## 🌱 Future Scope

AgriSync is designed with future integrations in mind, including:

* Real-time logistics and Maps integration.
* Live weather intelligence.
* ESP32/IoT sensor integration.
* Advanced agricultural analytics.
* Cloud-based backend infrastructure.
* Blockchain-supported verification records.
* Expanded QR-based traceability.
* Role-specific production dashboards.
* Real-time notifications and alerts.

The architecture is intentionally modular so these capabilities can be integrated progressively without rebuilding the entire platform.

---

## 🎓 Project Context

**AgriSync** is an academic / EPICS project focused on exploring how modern web technologies, IoT, intelligent logistics, and digital traceability can be combined to support agricultural supply-chain coordination.

The platform is developed as a technology prototype and does not claim to represent a government-backed or commercially operational agricultural network.

---

## 🌾 Vision

AgriSync aims to create a more connected agricultural ecosystem where technology can support better coordination between the people and infrastructure involved in moving produce from farms to markets.

### **FROM FARM TO MARKET.**

### **CONNECTED. SMART. TOGETHER.**

---

## 📄 License

This project is developed for academic and educational purposes.

© 2026 AgriSync — Academic / EPICS Project

