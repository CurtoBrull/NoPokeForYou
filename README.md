# NoPokeForYou

Aplicación web fullstack (React + Spring Boot) para buscar Pokémon, con modo troll usando Gemini AI. Desplegada en Render (backend y frontend separados).

## ¿Qué hace esta app?

- Permite buscar un Pokémon por nombre.
- El backend responde con un Pokémon diferente al buscado (modo troll, usando Gemini AI de Google).
- Si el usuario insiste, puede ver el Pokémon real.
- Interfaz moderna y responsiva (React + TailwindCSS).
- Rotación de claves Gemini para evitar límites.

## Estructura del proyecto

- `/src` (frontend React)
- `/src/main/java/eu/jcurtobr/nopokeforyou` (backend Spring Boot)
- `.env` (variables de entorno locales)
- `Dockerfile` (para despliegue backend)

## Variables de entorno

### Backend (Spring Boot)

Configura en Render (servicio backend):

- `GEMINI_API_KEY_NIV`, `GEMINI_API_KEY_CBJ`, ... (tus claves Gemini)
- `FRONTEND_URL` → URL de tu frontend en Render, por ejemplo:
  - `https://nopokeforyou-front.onrender.com`

### Frontend (React)

Configura en Render (Static Site):

- `VITE_API_URL` → URL base de la API, por ejemplo:
  - `https://nopokeforyou.onrender.com/api`

## Despliegue en Render

### 1. Backend (Spring Boot)

1. Crea un nuevo servicio en Render tipo "Web Service".
2. Elige tu repo y rama.
3. Usa el Dockerfile incluido (Render lo detecta automáticamente).
4. Añade las variables de entorno necesarias (ver arriba).
5. El puerto debe ser `8080` (por defecto en Spring Boot).
6. Haz deploy.

### 2. Frontend (React + Vite)

1. Crea un nuevo servicio en Render tipo "Static Site".
2. Elige tu repo y rama.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Añade la variable de entorno `VITE_API_URL` (ver arriba).
6. Haz deploy.

## Funcionamiento técnico

- El frontend usa `import.meta.env.VITE_API_URL` para llamar a la API.
- El backend usa `FRONTEND_URL` para permitir CORS solo desde el frontend.
- El backend rota entre varias claves Gemini para evitar bloqueos.
- El modo troll usa Gemini AI para devolver un Pokémon aleatorio y mensajes personalizados.

## Ejemplo de uso

1. El usuario busca "Pikachu".
2. El backend responde con otro Pokémon y un mensaje troll.
3. Si el usuario insiste, puede ver el resultado real.

## URLs de despliegue

- Frontend: https://nopokeforyou-front.onrender.com
- Backend/API: https://nopokeforyou.onrender.com/api

## Notas

- Si cambias variables de entorno en Render, recuerda redeployar el servicio.
- Si tienes problemas de CORS, revisa que las URLs estén bien configuradas y sin barra final.
- Render puede "dormir" el backend por inactividad. La primera petición tras un tiempo sin uso puede tardar hasta 1 minuto en responder mientras el servidor se reactiva. El frontend muestra un aviso automático al usuario sobre este comportamiento.

---

Desarrollado por Javier Curto Brull.
