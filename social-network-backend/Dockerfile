# Use a newer Maven image with JDK 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

RUN mkdir -p /tmp/social-network-backend

WORKDIR /tmp/social-network-backend

# Copy the source code
COPY src/ ./src/
COPY pom.xml .
COPY locale/ ./locale/
COPY scripts/ ./scripts/
COPY .env .

# Create folder to save uploaded
RUN mkdir -p /tmp/SocialMedia

# create uploadFiles, uploadImages to SocialMedia folder
RUN mkdir -p /tmp/SocialMedia/uploadFiles
RUN mkdir -p /tmp/SocialMedia/uploadImages

# Copy locale files to SocialMedia folder
RUN cp -r locale/ /tmp/SocialMedia

# Install dependencies and build the project
RUN mvn clean install -DskipTests

# Debug: List target directory
RUN ls -l /tmp/social-network-backend/target

# Use JDK 21 runtime for the application
FROM eclipse-temurin:21

# Copy the built WAR file from the build stage
COPY --from=build /tmp/social-network-backend/target/socialnetwork-0.0.1-SNAPSHOT.war /app.war

# Run the application
CMD ["java", "-jar", "/app.war"]
