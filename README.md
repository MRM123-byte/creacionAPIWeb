# Explorador de contenido aleatorio

Programación Web III — Página que consume cuatro APIs públicas (citas, perros, gatos y datos curiosos) con `fetch` y `async/await`.

## Integrantes

- Mauricio Rivero Mendez

## Instrucciones de ejecución

Es un sitio estático (HTML + CSS + JavaScript, Bootstrap por CDN). No requiere base de datos ni instalación.

1. Descarga o clona el proyecto.
2. Abre `index.html` en el navegador (doble clic), o sírvelo con cualquier servidor estático, por ejemplo:

   ```bash
   npx serve .
   ```
3. Se necesita conexión a Internet.

Estructura:

```
index.html
css/styles.css
js/app.js
```

## Respuestas de reflexión

**1. ¿Qué es un endpoint y cuál utilizaste para cada API?**
Un endpoint es una URL concreta de una API que expone un recurso o una operación; al enviarle una solicitud (aquí `GET`) devuelve datos. Usé:

| Sección | Endpoint |
|---|---|
| Citas (DummyJSON) | `https://dummyjson.com/quotes/random` |
| Perros (Dog CEO) | `https://dog.ceo/api/breeds/image/random` |
| Gatos (CATAAS) | `https://cataas.com/cat?json=true` y luego `https://cataas.com/cat/{id}` |
| Datos curiosos (Useless Facts) | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` |

**2. ¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?**
El JSON es texto estructurado que se convierte en un objeto con `response.json()` y del que se leen campos (`quote`, `message`, `id`…). Una imagen es contenido binario: no es JSON, por lo que `response.json()` fallaría. Se muestra asignando su URL al `src` de un `<img>`. Por eso con CATAAS primero pido el JSON (`?json=true`), tomo el `id` y construyo `https://cataas.com/cat/{id}` para el `<img>`.

**3. ¿Qué función cumplen `await` y `response.json()`?**
`await` pausa la función `async` hasta que la promesa se resuelva (la respuesta de `fetch`, la lectura del cuerpo) sin bloquear la página. `response.json()` lee el cuerpo de la respuesta y lo convierte en un objeto JavaScript; es asíncrono, por eso también lleva `await`.

**4. ¿Por qué se debe verificar `response.ok` además de utilizar `try/catch`?**
`fetch` solo rechaza la promesa ante fallos de red (sin Internet, DNS…). Si el servidor responde con 404 o 500, la promesa se cumple normalmente y no entra al `catch`. Verificar `response.ok` permite detectar esos códigos HTTP de error y lanzar un error propio que el `try/catch` sí maneja.

**5. ¿Cómo lograste actualizar una sección sin recargar toda la página?**
Cada sección tiene su propio botón y su propia función (`actualizarCita`, `actualizarPerro`, `actualizarGato`, `actualizarDato`). Al hacer clic, la función pide los datos con `fetch` y modifica solo el contenedor de esa tarjeta mediante el DOM (`replaceChildren`). No hay envío de formularios ni recargas, así que el resto de la página queda intacto y un fallo en una API no afecta a las demás.