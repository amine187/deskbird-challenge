# 🚀 User Manager

This project consists of a NestJS backend, an Angular frontend, and a PostgreSQL database managed via Docker Compose.

**🔗 Live Application:** The frontend application is deployed and available here:
[https://frontend-proud-moon-5284.fly.dev](https://frontend-proud-moon-5284.fly.dev)

## 📋 Project Structure

The project uses a mono-repository structure:

```
project-root/
├── backend/            # NestJS API (Port 3000)
├── frontend/           # Angular Application (Port 4200)
├── docker-compose.yaml # Defines database and pgAdmin services
└── .env.example        # Example environment variables
```

## 🛠️ Local Setup and Prerequisites

Before running the application, ensure you have the following installed:

  * **Node.js & npm:** (LTS version recommended)
  * **pnpm:** Used for package management. Install it globally: `npm install -g pnpm`
  * **Docker & Docker Compose:** Required to run the database.
  * **Angular CLI:** (`npm install -g @angular/cli`)

## ⚙️ Running the Backend (Database First)

The backend requires the PostgreSQL database to be running.

### 1\. Environment Configuration

1.  **Create Environment File:** Copy the provided example file to create your local environment file in the root directory:

    ```bash
    cp .env.example .env
    ```

2.  **Configure `.env`:** Open the new **`.env`** file. You must set the database credentials.

      * **Backend Application:** Reads the full connection string from `POSTGRES_DB_URL`.
      * **Docker Container:** Requires individual variables (e.g., `POSTGRES_USER`, `POSTGRES_PASSWORD`) to initialize the database user/schema.

### 2\. Database and Services Startup

1.  **Start Services:** Run Docker Compose from the project root directory:

    ```bash
    docker compose up -d database pgadmin
    ```

      * **PostgreSQL:** Runs on `localhost:5432`
      * **pgAdmin:** Runs on `localhost:5050` (Login credentials are set by `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` in your `.env` file).

### 3\. Seeding the Database (Initial Data)

After the database is running, you must seed it with initial user data.

1.  **Navigate to Backend and Install Dependencies (using pnpm):**
    ```bash
    cd backend
    pnpm install
    ```
2.  **Run Seed Script:**
    ```bash
    pnpm run seed:db
    ```
      * **Note:** The seed script runs after the database services are confirmed to be 'Up'.

### 4\. Start the NestJS API

**To start development:**

```bash
cd backend
pnpm run start:dev
```

The API will be available at **`http://localhost:3000`**.

-----

## 🌎 Running the Frontend

The Angular frontend requires the backend API to be running on port 3000.

1.  **Navigate to Frontend and Install Dependencies (using pnpm):**
    ```bash
    cd ../frontend
    pnpm install
    ```
2.  **Start Application:**
    ```bash
    pnpm start
    ```

The frontend application will be available at **`http://localhost:4200`**.

-----

## 🔑 Default User Credentials

Use these credentials to log in after successfully running the `seed:db` script.

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@deskbird.com` | `admin123` | ADMIN |
| **Simple User** | `john.doe@example.com` | `password123` | USER |

-----

## 🧪 Running Tests

All tests should be executed from the respective module directory using `pnpm`.

### Backend (NestJS) Tests

Run these commands from the **`backend/`** directory:

| Script | Command | Description |
| :--- | :--- | :--- |
| `test` | `pnpm test` | Runs all unit and integration tests once. |
| `test:watch` | `pnpm run test:watch` | Runs all tests in interactive watch mode. |
| `test:cov` | `pnpm run test:cov` | Runs tests and generates a code coverage report. |

### Frontend (Angular) Tests

Run these commands from the **`frontend/`** directory:

| Script | Command | Description |
| :--- | :--- | :--- |
| `test` | `pnpm test` | Runs unit tests (typically using Karma/Jasmine). |