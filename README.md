# CrowdFundX - Community Fundraising & Donation Platform

CrowdFundX is a full-stack MERN application designed for community fundraising. It allows users to create campaigns, accept donations via Razorpay, and track their fundraising progress.

## 🚀 Features

- **User Authentication**: Secure JWT-based signup and login.
- **Campaign Management**: Create, view, and manage fundraising campaigns.
- **Donation System**: Integrated with Razorpay for secure payments.
- **Dashboards**: Dedicated dashboards for Users and Admins.
- **Responsive Design**: Built with React and Tailwind CSS for a modern, mobile-first experience.
- **Search & Filter**: Find campaigns by category and sort by funding status.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcryptjs
- **Payment**: Razorpay
- **Tools**: Postman (Testing), Git

## 📂 Folder Structure

```
CrowdFundX/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Home, Dashboard, etc.)
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API services (Axios)
│   │   └── ...
├── server/                 # Node.js Backend
│   ├── config/             # Database config
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── middleware/         # Auth middleware
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB installed or Atlas URI
- Razorpay Account (for keys)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd CrowdFundX
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Create a `.env` file in `server/` with the following:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
- Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
- The app will be available at `http://localhost:5173`

## 🧪 Testing Guide

1. **Register**: Create a new account.
2. **Login**: Log in with your credentials.
3. **Create Campaign**: Go to "Start Campaign" and fill the form.
4. **Donate**: Browse campaigns, click on one, and try the Donate button. (Razorpay test mode).
5. **Dashboard**: Check "My Campaigns" and "My Donations".

## 🛡️ API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Campaigns**: `/api/campaigns` (GET, POST), `/api/campaigns/:id` (GET, PUT, DELETE)
- **Donations**: `/api/donations/create-order`, `/api/donations/verify`
- **Admin**: `/api/admin/stats`

## 📜 License
MIT
