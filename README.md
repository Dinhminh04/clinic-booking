# Clinic Booking

A full-stack web application that lets patients find doctors and book medical appointments online, with an admin dashboard to manage clinics, specialties, doctors and users.

## Description

### What the application does

Patients can browse clinics, specialties and doctors, open a doctor's detail page and book an appointment. Admins log in to a dashboard where they create, update and delete users, doctors, clinics and specialties. The interface supports both Vietnamese and English.

### Why these technologies

- **React + Redux:** the app has many pages sharing the same data (logged-in user, language, lists of doctors and clinics). Redux keeps that state in one place, and redux-persist keeps the user logged in after a page reload.
- **Node.js + Express:** using JavaScript on both frontend and backend keeps the codebase consistent, and Express is lightweight enough for a REST API of this size.
- **Sequelize ORM:** models and migrations make the database schema versioned and reproducible, instead of writing raw SQL by hand.
- **MySQL / MariaDB:** the data is relational by nature (a doctor belongs to a clinic and a specialty, a booking links a patient to a doctor), so a relational database fits.
- **react-intl:** handles the Vietnamese / English switch without duplicating pages.

### Challenges

- Modeling the relationship between doctors, clinics and specialties, solved with a separate `doctor_clinic_specialty` table.
- Keeping Redux state in sync between the admin pages and the public pages after create, update and delete actions.
- Supporting two languages across every page, including data coming from the database.

### Future features

- JWT authentication and role-based authorization on the API
- Doctor schedule management, so patients can only pick available time slots
- Email confirmation after a booking is created
- Patient medical history
- Deployment with Docker

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Installation and Running](#installation-and-running)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Author](#author)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 17, Redux , React Router, Bootstrap 5, react-intl |
| Backend | Node.js, Express, Sequelize ORM, bcrypt |
| Database | MySQL / MariaDB |

## Installation and Running

### Requirements

- Node.js 16 or later
- MySQL or MariaDB (for example via XAMPP)

### Step 1: Clone the repository

```bash
git clone https://github.com/Dinhminh04/clinic-booking.git
cd clinic-booking
```

### Step 2: Set up the backend

```bash
cd nodejs
npm install
cp .env.example .env
cp src/config/config.json.example src/config/config.json
```

- In `.env`, set `PORT=8080`.
- In `src/config/config.json`, set your database username, password and port.

### Step 3: Set up the database

Create an empty database named `dinhminh`, then run the migrations and seed data:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Step 4: Run the backend

```bash
npm start
```

The API runs at `http://localhost:8080`.

### Step 5: Set up and run the frontend

Open a new terminal:

```bash
cd Reactjs
npm install
cp .env.example .env
npm start
```

The app runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Login |
| GET | `/api/get-all-clinics` | List clinics |
| POST | `/api/create-clinic` | Create a clinic |
| PUT | `/api/update-clinic` | Update a clinic |
| DELETE | `/api/delete-clinic` | Delete a clinic |
| GET | `/api/get-all-specialties` | List specialties |
| POST | `/api/create-specialty` | Create a specialty |
| PUT | `/api/update-specialty` | Update a specialty |
| DELETE | `/api/delete-specialty` | Delete a specialty |
| GET | `/api/get-all-doctors` | List doctors |
| POST | `/api/create-doctor` | Create a doctor |
| PUT | `/api/update-doctor` | Update a doctor |
| DELETE | `/api/delete-doctor` | Delete a doctor |
| POST | `/api/create-booking` | Create a booking |
| GET | `/api/get-booking-by-patient` | Get bookings of a patient |

## Project Structure

```
clinic-booking/
├── Reactjs/          # Frontend (React + Redux)
│   └── src/
│       ├── containers/   # Pages: HomePage, Auth, System (admin)
│       ├── components/   # Shared UI components
│       ├── services/     # API calls (axios)
│       ├── store/        # Redux actions and reducers
│       └── translations/ # vi.json, en.json
└── nodejs/           # Backend (Express + Sequelize)
    └── src/
        ├── controllers/  # Request handlers
        ├── services/     # Business logic
        ├── models/       # Sequelize models
        ├── migrations/   # Database migrations
        ├── seeders/      # Seed data
        └── route/        # API routes
```

## Author

Dinh Minh — [github.com/Dinhminh04](https://github.com/Dinhminh04)
