# Social Network Project

## Overview

This project is a **Social Network** platform that integrates e-commerce capabilities, allowing users to connect, share, and engage in social activities while also providing seamless online shopping experiences. The application is built using modern web technologies and is designed with a client-server architecture. Future iterations will include Web3 integration to enhance security and enable decentralized user accounts and payment methods via blockchain.

## Features

- **User Profiles**: Create and manage user profiles with personal information, photos, and activity feeds.
- **Social Networking**: Connect with friends, follow other users, post updates, and interact with posts via likes, comments, and shares.
- **E-commerce Integration**: Explore and purchase products directly within the social network platform, with options for sellers to list and manage their products.
- **Real-time Notifications**: Get real-time updates on friend activities, messages, and other important events.
- **Web3 Integration (Future)**: Planned integration of blockchain technology for decentralized user authentication and secure, transparent payment methods.

## Technology Stack

### Frontend

- **ReactJS**: For building the user interface and ensuring a dynamic and responsive user experience.
- **Redux**: To manage application state and ensure efficient data handling across the application.
- **CSS/SCSS**: For styling the application and ensuring a consistent, visually appealing user interface.

### Backend

- **Spring Boot**: Serving as the primary backend framework, handling REST APIs, authentication, and business logic.
- **PostgreSQL**: Used as the relational database for storing user data, posts, transactions, and other essential information.
- **REST API**: The application backend is designed using a client-server architecture.

### Web3 (Future Implementation)

- **Blockchain**: To be integrated for managing user accounts, identities, and payment methods securely and transparently.
- **Smart Contracts**: For handling transactions, ensuring security, and maintaining trust between parties.

## Getting Started

### Prerequisites

- **Java**: Required to run the Spring Boot backend services.
- **PostgreSQL**: Required for setting up the database.

### Installation

1. **Clone the Repository ([SSH - Setup your github account](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)):**

   ```sql
   git clone git@github.com:SOCIAL-NETWORK-2425/social-network-backend.git
   ```

2. **Set up the Database:**

   - **Step 1: Install PostgreSQL**

     Download PostgreSQL version 16 from the [official website](https://www.postgresql.org/download/windows/).

   - **Step 2: Create the `SocialMedia` Database**

     Access the SQL Shell (`psql`) and create the database by running:

     ```sql
     CREATE DATABASE SocialMedia;
     ```

   - **Step 3: Configure the `.env` File**

     Set up your `.env` file according to the `env-sample` provided in the repository.
     
   - **Step 4: Configure Folders**

     Ensure you have the necessary directories (`uploadFiles`, `uploadImages`) inside the `SocialNetwork` folder. If these folders are missing, navigate to the `scripts` directory and run the following script:

      - **For Ubuntu**:
      
         ```sql
         ./init_folder.sh
         ```

      - **For Window**:
        
         ```sql
         ./init_folder.bat
         ```

   - **Step 5: Run the Application**
     
