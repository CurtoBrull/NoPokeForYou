package eu.jcurtobr.nopokeforyou;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        String frontendUrl = System.getenv().getOrDefault("FRONTEND_URL", "https://TU_DOMINIO_PRODUCCION.com");
        String[] allowedOrigins;
        if (frontendUrl.contains("localhost")) {
          allowedOrigins = new String[] { "http://localhost:3000" };
        } else {
          allowedOrigins = new String[] { frontendUrl };
        }
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*");
      }
    };
  }
}
