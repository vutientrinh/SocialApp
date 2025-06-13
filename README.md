# Social Media Application with Docker Compose

This guide provides step-by-step instructions for setting up and running the Social Media Application using Docker Compose. The application consists of two services:

#### Frontend
- **Framework**: React
- **State Management**: Redux
- **UI Components**: Material-UI (MUI)

#### Backend
- **Framework**: Spring Boot
- **Real-time Communication**: Socket.IO
- **Additional Integrations**:
  - **AssemblyAI**: For speech-to-text processing
  - **LLMs**: Ollama Model 3.2 (1B parameters) for advanced AI capabilities

#### Database
- **Relational Database**: PostgreSQL

#### Deployment & Infrastructure
- **Cloud Storage & Services**: Google Cloud Platform (GCP)
- **Media Management**: Cloudinary
- **Containerization**: Docker

## Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started) (latest version recommended)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Step 1: Pull the Required Docker Images

1. **Log in to Docker Hub**  
   Run the following command to log in to Docker Hub:

   ```bash
   docker login
   ```

   Enter your Docker Hub username and password when prompted.

2. **Pull the Frontend Image**

   ```bash
   docker pull duyho03/react-social-network:latest
   ```

3. **Pull the Backend Image**
   ```bash
   docker pull duyho03/spring-social-network:latest
   ```
4. **Pull the PostgreSQL Image**
   ```bash
   docker pull postgres:latest
   ```

## Step 2: Prepare the Database

### 1. Download `dump.sql`

Obtain the `dump.sql` file containing the database schema and initial data. Place this file in your project directory.

### 2. Database Configuration

Ensure the `dump.sql` file is referenced in the PostgreSQL container by following these steps:

1. Copy the `dump.sql` file to the PostgreSQL container:
   ```bash
   docker cp <current_path_sql> <container_id>:/dump.sql
   ```
2. Restore the database using the pg_restore command:
   ```bash
   docker exec -it <container_id> pg_restore -U postgres -d SocialMedia < /dump.sql
   ```

## Step 3: Create `docker-compose.yml`

Create a `docker-compose.yml` file in your project directory with the following content:

```yaml
version: "3.8"

services:
  frontend:
    image: duyho03/react-social-network:latest
    container_name: react-social-network
    ports:
      - "3001:3000"
    environment:
      REACT_APP_BACKEND_URL: http://backend:8081/
      REACT_APP_FRONTEND_URL: /
      REACT_APP_CLOUDINARY_URL: https://res.cloudinary.com/dtrb7dkmw/image/upload/
    depends_on:
      - backend
    networks:
      - social-network-net

  backend:
    image: duyho03/spring-social-network:latest
    container_name: spring-social-network
    ports:
      - "8081:8080"
    environment:
      DATABASE_URL: jdbc:postgresql://database:5432/social_network
      DATABASE_USERNAME: your_username
      DATABASE_PASSWORD: your_password
      BASE_FOLDER_UPLOAD: /tmp/uploadFiles
      IMAGE_FOLDER: /tmp/uploadImages
      PUBLIC_FOLDER: /tmp/SocialMedia
      CLOUDINARY_CLOUD_NAME: dtrb7dkmw
      CLOUDINARY_API_KEY: 664655242756534
      CLOUDINARY_API_SECRET: Kz4Js4pvAFcEWyGFPtzv1MJm7B4
      CLOUDINARY_URL: cloudinary://664655242756534:Kz4Js4pvAFcEWyGFPtzv1MJm7B4@dtrb7dkmw
      JWT_SECRET: 9a4f2c8d3b7a1e6f45c8a0b3f267d8b1d4e6f3c8a9d2b5f8e3a9c8b5f6v8a3d9b1c3e2f4a6b7d8e9f1c3d4a5b6c7d8e9f1a2b3c4d5e6f7a8b9c0
    depends_on:
      - database
    networks:
      - social-network-net

  database:
    image: postgres:latest
    container_name: postgres-database
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: SocialMedia
    networks:
      - social-network-net

networks:
  social-network-net:
```

## Step 4: Start the Application

1. **Navigate to the Project Directory**

   Open a terminal and navigate to the directory containing `docker-compose.yml`.

2. **Run Docker Compose**

   Use the following command to start the application:

   ```bash
    docker-compose up -d
   ```

3. **Verify Containers**
   Check that the containers are running:

   ```bash
    docker ps
   ```

## Step 5: Access the Application

- **Frontend**: Open your browser and navigate to [http://localhost:3001](http://localhost:3001) to access the frontend application.

- **Backend API**: Access the backend API at [http://localhost:8081](http://localhost:8081).

- **Database**: Connect to the PostgreSQL database at `localhost:5432` using the following credentials:
  - **Username**: `postgres`
  - **Password**: `postgres`
  - **Database**: `SocialMedia`
