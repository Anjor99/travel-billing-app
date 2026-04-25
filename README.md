# 🚕 Travel Billing Application

A full‑stack **Travel Billing System** that allows transport businesses to generate professional trip invoices, manage customers, and download/share bills as PDFs.

Built using **FastAPI + React + PostgreSQL**, with support for **custom header/footer branding**, email verification, and password recovery.

---

# 🌟 Features

## 🔐 Authentication

* User Registration
* Email Verification
* Login with JWT Authentication
* Forgot Password
* Reset Password
* Protected Routes

---

## 🧾 Billing System

* Create Trip Bills
* Edit Existing Bills
* Delete Bills
* View Bill List
* Search Bills
* Filter Bills
* Bill Aggregations:

  * Total Bills
  * Total Amount

---

## 📄 PDF Generation

* Generate professional travel bills
* Custom invoice-style layout
* Download bill as PDF
* Share bill PDF
* Support for:

  * Header image
  * Footer image
  * ₹ symbol
  * Amount in words

---

## 🖼 Branding (Header/Footer)

Users can:

* Upload header logo
* Upload footer/signature
* Crop images with fixed ratio
* Delete or replace images
* Images stored using **Cloudinary**

---

## 📱 Mobile Friendly UI

* Responsive layouts
* Sticky navigation
* Scrollable bill lists
* Mobile‑optimized components

---

# 🏗 Tech Stack

## Frontend

* React
* Material UI (MUI)
* Axios
* React Router
* React Easy Crop

## Backend

* FastAPI
* PostgreSQL
* Psycopg2
* JWT Authentication
* Jinja2 Templates
* SMTP Email Service

## File Storage

* Cloudinary (Header/Footer images)

## PDF Generation

* ReportLab

---

# 📁 Project Structure

```
travel-billing-app/

├── backend/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── bills.py
│   │   └── settings.py
│   │
│   ├── services/
│   │   └── email_service.py
│   │
│   ├── templates/
│   │   └── email/
│   │       ├── verify_email.html
│   │       └── forgot_password.html
│   │
│   ├── utils/
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   ├── schemas/
│   │   ├── auth_schema.py
│   │   └── bill_schema.py
│   │
│   ├── config.py
│   ├── database.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── context/
│   │   └── utils/
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/travel-billing-app.git

cd travel-billing-app
```

---

# 🗄 Backend Setup

Go to backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate:

Windows:

```bash
venv\Scripts\activate
```

Linux / Mac:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create:

```
.env
```

Inside backend folder.

Add:

```env
# Database
DB_HOST=localhost
DB_NAME=travel_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# App URL
APP_BASE_URL=http://localhost:8000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 🗄 Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE travel_db;
```

Run the provided SQL schema file to create all tables:

```bash
psql -U postgres -d travel_db -f schema.sql
```

The repository includes a **`.sql` file** containing the complete empty table structure (users, customers, vehicles, trips, bills, etc.), so you don't need to manually create tables.

---

# ▶️ Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

# 🎨 Frontend Setup

Go to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 📦 Build Frontend

```bash
npm run build
```

Build output:

```
frontend/dist
```

Served automatically by FastAPI.

---

# ☁️ Deployment (Render)

Backend:

* Deploy FastAPI service
* Add environment variables
* Connect PostgreSQL database

Frontend:

* Built into backend static files

Cloudinary:

* Stores header/footer images

---

# 🔐 Authentication Flow

```
Register
    ↓
Verify Email
    ↓
Login
    ↓
JWT Token Stored
    ↓
Access Protected Routes
```

---

# 🔄 Forgot Password Flow

```
Forgot Password
      ↓
Email Reset Link
      ↓
Reset Password Page
      ↓
Password Updated
```

---

# 📄 Bill Workflow

```
Create Bill
      ↓
Store Trip + Customer
      ↓
Generate PDF
      ↓
Download / Share
```

---

# 📸 Screenshots (Recommended)

Add screenshots of:

* Login Page
* Create Bill Page
* View Bills Page
* PDF Output
* Settings Page

These significantly improve portfolio value.

---

# 🚀 Future Improvements

* Multi-user roles
* GST support
* Export Excel
* WhatsApp sharing
* Dashboard analytics
* Multiple bill templates

---

# 🧠 Learning Outcomes

This project demonstrates:

* Full‑stack development
* JWT authentication
* REST API design
* Database relationships
* PDF generation
* Cloud image storage
* Responsive UI design

---

# 👨‍💻 Author

**Anjor**

Full‑stack developer project built using modern production-ready technologies.
