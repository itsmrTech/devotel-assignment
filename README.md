
# Job Offer API (NestJS)

This project is a **NestJS-based Job Offer API** that integrates with external job offer providers, processes job data, and serves it through REST endpoints.

---

## **📌 Features**
✅ Fetch job offers from multiple external APIs  
✅ Transform and normalize job data  
✅ Store job offers in a database  
✅ Scheduled cron job to update job listings  
✅ API endpoints for retrieving job offers  
✅ Unit and E2E testing with Jest  

---

## **📌 Tech Stack**
- **NestJS** (Framework)
- **TypeORM** (Database ORM)
- **PostgreSQL / MySQL** (Database)
- **Jest** (Unit & E2E Testing)
- **Swagger** (API Documentation)
- **Axios** (External API Calls)
- **Supertest** (E2E Testing)

---

## **📌 Getting Started**

### **1️⃣ Prerequisites**
- **Node.js** (`>=16.x`)
- **Yarn** (or NPM)
- **PostgreSQL** (if running locally)

---

### **2️⃣ Installation**
Clone the repository and install dependencies:
```sh
git clone https://github.com/itsmrTech/devotel-assignment.git
cd devotel-assignment
yarn install
```

---

### **3️⃣ Environment Variables**
Create a `.env` file in the root directory:

```env
DATABASE_URL=postgres://user:password@localhost:5432/jobdb
EXTERNAL_API_URL_1=https://assignment.devotel.io/api/provider1/jobs
EXTERNAL_API_URL_2=https://assignment.devotel.io/api/provider2/jobs
CRON_JOB_OFFER_SCHEDULE=*/30 * * * * 
API_REQUEST_RETRIES=3
```

---

### **4️⃣ Running the Server**
####  Start in Development Mode
```sh
yarn start:dev
```

---

## **📌 API Documentation**
Swagger API docs are available at:
```
http://localhost:3000/api/docs
```

---

## **📌 Testing**
### **🧪 Run Unit Tests**
```sh
yarn test
```

### **🚀 Run E2E Tests**
```sh
yarn test:e2e
```

### **🔄 Run Tests with Coverage**
```sh
yarn test:cov
```



---

## **📌 License**
This project is licensed under **MIT License**.

