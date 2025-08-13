# ---- build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

# ---- run
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV DB_URL=jdbc:postgresql://db:5432/activities
ENV DB_USER=app
ENV DB_PASS=app
ENTRYPOINT ["java","-jar","/app/app.jar"]