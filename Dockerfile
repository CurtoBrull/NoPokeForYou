# Dockerfile para Spring Boot (Render.com)
# Usa una imagen oficial de OpenJDK para construir el JAR
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Usa una imagen ligera de Java para ejecutar el JAR
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Render expone el puerto 8080 por defecto
EXPOSE 8080
# Carga variables de entorno si existen
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
