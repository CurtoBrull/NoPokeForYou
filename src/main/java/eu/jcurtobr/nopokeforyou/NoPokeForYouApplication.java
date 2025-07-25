package eu.jcurtobr.nopokeforyou;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NoPokeForYouApplication {

    public static void main(String[] args) {
        // Cargar variables de entorno desde .env usando dotenv-java
        try {
            io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure().ignoreIfMissing()
                    .load();
            dotenv.entries().forEach(entry -> {
                // Solo setear si no existe ya en el entorno
                if (System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } catch (Exception e) {
            System.out.println("No se pudo cargar .env: " + e.getMessage());
        }
        SpringApplication.run(NoPokeForYouApplication.class, args);
    }

}
