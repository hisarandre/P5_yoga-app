# Yoga-app

## 📌 Description

Yoga-app is a full-stack application designed to manage sessions, teachers, and users.

---

## 🚀 Installation


Before installing the application, start by cloning the project from GitHub:

```bash
git clone https://github.com/hisarandre/P5_yoga-app.git
cd P5_yoga-app
```

### 🛠️ Requirements



| Technology      | Version        | Description                            |
|-----------------|----------------|----------------------------------------|
| **[Node.js](https://nodejs.org/)**     | ≥16.x          | JavaScript runtime environment         |
| **[Angular CLI](https://angular.io/cli)** | ≥14.x          | Angular command line interface         |
| **[Java JDK](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)** | 8 ≤ version ≤ 17 | Java Development Kit                   |
| **[Maven](https://maven.apache.org/)** | ≥3.8           | Build automation tool                  |
| **[MySQL](https://dev.mysql.com/downloads/mysql/)** | ≥8.0           | Relational database                    |


### 🛠️ Database configuration

1. Start MySQL and create the database:
   ```sql
   CREATE DATABASE yoga_app;
   ```
2. Update the connection details in **back/src/main/resources/application.properties**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/yoga_app?allowPublicKeyRetrieval=true
   spring.datasource.username=YOUR_DB_USER  
   spring.datasource.password=YOUR_DB_PASSWORD
   ```
3. Execute the SQL script in resources/sql/script.sql

### 🛠️ Backend Installation

1. Navigate to the backend:
   ```bash
   cd back
   ```
2. Build and run the project:
   ```bash
   mvn spring-boot:run
   ```
3. The backend will be accessible at **[http://localhost:8080](http://localhost:8080)**

### 🛠️ Frontend Installation

1. Navigate to the frontend:
   ```bash
   cd front
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. The frontend will be accessible at **[http://localhost:4200](http://localhost:4200)**

---

## ✅ Application Usage


### 📌 Authentication

The application uses a JWT authentication system.

- **Test Admin User**: `yoga@studio.com / test!1234`

## 🔬 Testing

### Backend Tests

Run unit and integration tests with the following command:

```bash
mvn clean verify
```

The coverage report is generated at:

```bash
back/yoga-app/target/site/jacoco/index.html
```

### Frontend Tests

Run the unit and integration test with the following command:

```bash
cd front
npm run test:coverage
```

Test results and the coverage report are generated at:

```bash
front/coverage/combined-report/lcov-report/index.html
```

### 3️⃣ End-to-End Tests (Cypress)

Run E2E tests with:

```bash
npm run e2e:ci
```

Generate a Cypress coverage report with:

```bash
npm run e2e:coverage
```

Test coverage report is generated at:

```bash
front/coverage/e2e/index.html
```