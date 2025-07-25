package eu.jcurtobr.nopokeforyou;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpMethod;

@RestController
@RequestMapping("/api")
public class PokeController {
    private static final Logger logger = LoggerFactory.getLogger(PokeController.class);
    private static List<String> geminiKeysCache = null;
    private static int geminiKeyIndex = 0;

    @GetMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/pokemon/{name}")
    public ResponseEntity<String> getPokemon(
            @PathVariable String name,
            @RequestParam(value = "real", required = false) Boolean real,
            @RequestParam(value = "model", required = false) String model,
            @RequestParam(value = "prompt", required = false) String customPrompt,
            @RequestParam(value = "warning", required = false) String warningParam) {
        if (Boolean.TRUE.equals(real)) {
            // Buscar el Pokémon real
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase();
            try {
                String result = restTemplate.getForObject(url, String.class);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                logger.error("Error consultando PokéAPI para {}: {}", name, e.getMessage(), e);
                return ResponseEntity.status(404).body("{\"error\":\"No se encontró el Pokémon\"}");
            }
        } else {
            // Modo troll (Gemini) por defecto
            // Rotador round-robin de claves Gemini
            if (geminiKeysCache == null) {
                geminiKeysCache = new ArrayList<>();
                // Buscar en variables de entorno
                for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
                    if (entry.getKey().startsWith("GEMINI_API_KEY_")) {
                        geminiKeysCache.add(entry.getValue());
                    }
                }
                // Buscar en propiedades de sistema (para soporte .env)
                for (Object keyObj : System.getProperties().keySet()) {
                    String key = keyObj.toString();
                    if (key.startsWith("GEMINI_API_KEY_")) {
                        String value = System.getProperty(key);
                        if (value != null && !geminiKeysCache.contains(value)) {
                            geminiKeysCache.add(value);
                        }
                    }
                }
            }
            if (geminiKeysCache.isEmpty()) {
                return ResponseEntity.status(500).body("{\"error\":\"No Gemini API keys configured\"}");
            }
            String selectedKey;
            synchronized (PokeController.class) {
                selectedKey = geminiKeysCache.get(geminiKeyIndex % geminiKeysCache.size());
                geminiKeyIndex++;
            }
            try {
                RestTemplate restTemplate = new RestTemplate();
                String modelName = (model != null && !model.isBlank()) ? model : "gemini-2.0-flash";
                String geminiUrl = "https://generativelanguage.googleapis.com/v1/models/" + modelName
                        + ":generateContent?key=" + selectedKey;
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Si el usuario está pidiendo el real (pero no con real=true), añade un warning
                // IA
                boolean warningRequest = false;
                if ((customPrompt != null && customPrompt.contains("warning")) || (warningParam != null)) {
                    warningRequest = true;
                }

                // Prompt para obtener nombre y motivo troll
                // Para forzar aleatoriedad, añade un número random y pide explícitamente que
                // elija uno distinto cada vez
                int randomSeed = (int) (Math.random() * 1000000);
                String prompt = (customPrompt != null && !customPrompt.isBlank() && !warningRequest)
                        ? customPrompt
                        : ("Dame el nombre de un Pokémon aleatorio de la Pokédex que NO sea '" + name
                                + "', ni uno que hayas dado antes, y que sea diferente cada vez (usa este número como semilla: "
                                + randomSeed
                                + "). Sé muy creativo y nunca repitas. Además, añade una frase graciosa explicando por qué NO puedo dar el Pokémon '"
                                + name
                                + "' (el que pidió el usuario), NO el alternativo. La frase debe referirse SIEMPRE a '"
                                + name
                                + "'. Responde en formato JSON así: {\\\"name\\\": \\\"NOMBRE\\\", \\\"reason\\\": \\\"MOTIVO\\\"}. No pongas nada más, solo el JSON.");
                String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + prompt + "\"}]}]}";
                HttpEntity<String> entity = new HttpEntity<>(body, headers);
                ResponseEntity<String> geminiResponse = restTemplate.exchange(geminiUrl, HttpMethod.POST, entity,
                        String.class);

                // Procesar respuesta Gemini para extraer el JSON generado
                ObjectMapper mapper = new ObjectMapper();
                String nombre = "";
                String motivo = "";
                String warning = "";
                try {
                    JsonNode root = mapper.readTree(geminiResponse.getBody());
                    String text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text")
                            .asText("").trim();
                    text = text.replaceAll("[\u0000]", "").trim();
                    int start = text.indexOf("{");
                    int end = text.lastIndexOf("}");
                    String jsonStr = (start != -1 && end != -1 && end > start) ? text.substring(start, end + 1) : text;
                    JsonNode jsonNode = null;
                    try {
                        jsonNode = mapper.readTree(jsonStr);
                        nombre = jsonNode.path("name").asText("");
                        motivo = jsonNode.path("reason").asText("");
                    } catch (Exception ex2) {
                        nombre = text;
                        motivo = "¡Motivo no disponible!";
                    }
                } catch (Exception ex) {
                    logger.error("Error parseando respuesta de Gemini: {}", ex.getMessage(), ex);
                }

                // Si warningRequest, pedir un mensaje gracioso de advertencia a Gemini
                if (warningRequest) {
                    try {
                        String warningPrompt = "Genera una frase graciosa y breve para un usuario que insiste en ver el Pokémon '"
                                + name
                                + "' (el que pidió), pero esta app es para trollear. La frase debe referirse SIEMPRE a '"
                                + name
                                + "' y nunca al Pokémon alternativo que se muestra. Hazle dudar, pero dile que si insiste puede que se lo des. No pongas nada más, solo la frase.";
                        String warningBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + warningPrompt + "\"}]}]}";
                        HttpEntity<String> warningEntity = new HttpEntity<>(warningBody, headers);
                        ResponseEntity<String> warningResponse = restTemplate.exchange(geminiUrl, HttpMethod.POST,
                                warningEntity, String.class);
                        JsonNode warningRoot = mapper.readTree(warningResponse.getBody());
                        String warningText = warningRoot.path("candidates").path(0).path("content").path("parts")
                                .path(0).path("text").asText("").trim();
                        warning = warningText.replaceAll("[\u0000]", "").trim();
                    } catch (Exception exw) {
                        warning = "¿Seguro que quieres el real? Esta app es para trollear...";
                    }
                }

                String json = String.format("{\"name\":\"%s\",\"reason\":\"%s\",\"warning\":\"%s\"}",
                        nombre.replace("\"", "'"), motivo.replace("\"", "'"), warning.replace("\"", "'"));
                return ResponseEntity.ok(json);
            } catch (Exception e) {
                logger.error("Error consultando Gemini para {}: {}", name, e.getMessage(), e);
                return ResponseEntity.status(500).body("{\"error\":\"Error al consultar Gemini\"}");
            }
        }
    }
}
