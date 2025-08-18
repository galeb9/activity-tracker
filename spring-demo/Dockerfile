FROM maven:3.9-eclipse-temurin-17 AS dev
WORKDIR /app
COPY pom.xml .
RUN mvn -v && mvn -q -DskipTests dependency:go-offline
COPY . .
EXPOSE 8080
CMD ["mvn", "spring-boot:run"]