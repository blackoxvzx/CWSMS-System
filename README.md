# CWSMS - Car Washing Sales Management System

SmartPark car washing sales management web application (TSS National Integrated Assessment 2024–2025).

## Structure

- **backend-project** – Node.js + Express, MySQL, session-based auth
- **frontend-project** – React, Vite, Tailwind CSS, Axios
- **ERD.md** – Entity Relationship Diagram description (draw on paper as per instructions)
- **database/init.sql** – Database schema and seed data

## Prerequisites

- Node.js (v18+)
- MySQL Server
- npm or yarn

## Setup

### 1. Database

1. Create database and tables using MySQL:

```bash
cd backend-project
mysql -u root -p < database/init.sql
```

Or run the contents of `backend-project/database/init.sql` in MySQL Workbench or any MySQL client.

### 2. Backend

```bash
cd backend-project
cp .env.example .env
# Edit .env: set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (CWSMS)
npm install
npm start
```

Backend runs at **http://localhost:5000**.

### 3. Frontend

```bash
cd frontend-project
npm install
npm run dev
```

Frontend runs at **http://localhost:3000** and proxies `/api` to the backend.

## Default Login

- **Username:** receptionist  
- **Password:** receptionist123  

## Menu (Pages)

- **Car** – Register cars (insert only)
- **Packages** – Add and list service packages (insert + list)
- **ServicePackage** – Create, list, update, delete service records; generate bill
- **Payment** – Record payments (insert + list)
- **Reports** – Daily report: PlateNumber, PackageName, PackageDescription, AmountPaid, PaymentDate
- **Logout** – Session logout

## CRUD Rules (per assessment)

- **Insert** on all four forms: Car, Packages, ServicePackage, Payment
- **Delete, Update, Retrieve** only on ServicePackage (Service Record) form

## Seed Data (Packages)

- Basic wash – Exterior hand wash – 5,000 RWF  
- Classic wash – Interior hand wash – 10,000 RWF  
- Premium wash – Exterior and Interior hand wash – 20,000 RWF  

## Saving Work (per assessment)

Save your work in a folder named: **FirstName_LastName_National_Practical_Exam_2025**

## Removing Project (per assessment)

Remove the project and related configurations only after being marked, and ask permission from the assessor before removing.
