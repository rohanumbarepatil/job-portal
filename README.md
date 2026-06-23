# Job Portal

A modern, scalable, and fully decoupled Job Portal platform. Designed for high performance, the system leverages a Single Page Application (SPA) frontend, a stateless Spring Boot backend, and Firebase for robust Identity, NoSQL Database, and Object Storage solutions.

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Distinct experiences and permissions for Job Seekers, Employers, and Administrators.
- **Stateless Architecture**: Infinite horizontal scalability achieved through strict JWT-based authentication.
- **Direct-to-Cloud Storage**: Secure, efficient file uploads (resumes, company logos) using signed URLs or Firebase SDK directly, avoiding backend bottlenecks.
- **Interactive Dashboards**: Comprehensive analytics and metrics overviews for recruiters and employers.
- **Application Tracking**: End-to-end tracking for job applications, from submission to interview scheduling.
- **Responsive Design**: Mobile-first, utility-driven UI components crafted with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend Layer
- **Framework**: React 19 + Vite for blazing-fast builds and HMR.
- **Styling**: Tailwind CSS for highly responsive, utility-first UI design.
- **State Management**: Zustand for lightweight, global state handling.
- **Routing**: React Router DOM.
- **UI Components**: Recharts for analytics, React Big Calendar for scheduling, and Drag-and-Drop support.

### Backend Layer
- **Framework**: Java + Spring Boot (RESTful API architecture).
- **Security**: Spring Security integrated with Firebase Token Filters.
- **Architecture**: Layered design (Controllers, Services, Repositories, DTOs).

### Data & Cloud Services (Firebase)
- **Database**: Firestore (Scalable NoSQL document database).
- **Authentication**: Firebase Auth (Email/Password, OAuth).
- **Storage**: Firebase Storage for binary assets.

## 📂 Project Structure

The repository is divided into two primary directories, ensuring complete decoupling:

- **/Frontend**: The React application, organized by feature domains (auth, jobs, applications, profile).
- **/Backend**: The Spring Boot application, structured with clean separation of concerns and data models mapping to Firestore collections.

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Java Development Kit (JDK)** (Version 17+)
- **Maven**
- **Firebase Account** (for Auth, Firestore, and Storage setup)

### Local Development Setup

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

#### 2. Frontend Setup
```bash
cd Frontend
npm install
# Configure your Firebase credentials in the appropriate config file (.env)
npm run dev
```

#### 3. Backend Setup
```bash
cd Backend
# Ensure your firebase-key.json and environment properties are set in src/main/resources/
./mvnw spring-boot:run
```

## 📐 Architecture

For a deep dive into the system design, data modeling (Firestore collections), and security architecture, please refer to the [Architecture Design Document](./architecture_design.md).
