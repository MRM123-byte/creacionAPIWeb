"use strict";

// ---------- Endpoints ----------
const URL_CITA = "https://dummyjson.com/quotes/random";
const URL_PERRO = "https://dog.ceo/api/breeds/image/random";
const URL_GATO_JSON = "https://cataas.com/cat?json=true";
const URL_GATO_IMAGEN = "https://cataas.com/cat/"; // + {id}
const URL_DATO = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

// ---------- Utilidades ----------

// Hace la petición y valida response.ok antes de leer el JSON.
async function pedirJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  return await response.json();
}

function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function mostrarCargando(contenedor, boton) {
  boton.disabled = true;
  contenedor.replaceChildren(crearElemento("p", "status-message", "Cargando…"));
}

function mostrarError(contenedor, mensaje) {
  contenedor.replaceChildren(crearElemento("p", "status-message error-message", mensaje));
}

// Crea una imagen con texto alternativo y manejo de error de carga.
// Devuelve una promesa que se resuelve cuando la imagen cargó o falla.
function cargarImagen(url, textoAlternativo) {
  return new Promise((resolve, reject) => {
    const imagen = document.createElement("img");
    imagen.alt = textoAlternativo;
    imagen.onload = () => resolve(imagen);
    imagen.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    imagen.src = url;
  });
}

// ---------- Una función independiente por API ----------

async function obtenerCita() {
  const datos = await pedirJson(URL_CITA);
  if (!datos.quote || !datos.author) throw new Error("Respuesta inesperada de la API de citas.");
  return { texto: datos.quote, autor: datos.author };
}

async function obtenerImagenPerro() {
  const datos = await pedirJson(URL_PERRO);
  if (!datos.message) throw new Error("Respuesta inesperada de la API de perros.");
  return datos.message;
}

async function obtenerImagenGato() {
  // Se consulta el JSON solo para conocer el identificador; la imagen en sí
  // se pide después mediante /cat/{id} (no se usa response.json() sobre ella).
  const datos = await pedirJson(URL_GATO_JSON);
  const id = datos.id || datos._id;
  if (!id) throw new Error("Respuesta inesperada de la API de gatos.");
  return URL_GATO_IMAGEN + encodeURIComponent(id);
}

async function obtenerDatoCurioso() {
  const datos = await pedirJson(URL_DATO);
  if (!datos.text) throw new Error("Respuesta inesperada de la API de datos curiosos.");
  return datos.text;
}

// ---------- Funciones que actualizan cada sección ----------

async function actualizarCita() {
  const contenedor = document.getElementById("cita-contenido");
  const boton = document.getElementById("cita-boton");
  mostrarCargando(contenedor, boton);
  try {
    const cita = await obtenerCita();
    contenedor.replaceChildren(
      crearElemento("p", "quote-text", `“${cita.texto}”`),
      crearElemento("p", "quote-author", `— ${cita.autor}`)
    );
  } catch (error) {
    console.error(error);
    mostrarError(contenedor, "No se pudo obtener la cita. Revisa tu conexión e intenta de nuevo.");
  } finally {
    boton.disabled = false;
  }
}

async function actualizarPerro() {
  const contenedor = document.getElementById("perro-contenido");
  const boton = document.getElementById("perro-boton");
  mostrarCargando(contenedor, boton);
  try {
    const urlImagen = await obtenerImagenPerro();
    const imagen = await cargarImagen(urlImagen, "Fotografía aleatoria de un perro");
    contenedor.replaceChildren(imagen);
  } catch (error) {
    console.error(error);
    mostrarError(contenedor, "No se pudo mostrar el perro. Revisa tu conexión e intenta de nuevo.");
  } finally {
    boton.disabled = false;
  }
}

async function actualizarGato() {
  const contenedor = document.getElementById("gato-contenido");
  const boton = document.getElementById("gato-boton");
  mostrarCargando(contenedor, boton);
  try {
    const urlImagen = await obtenerImagenGato();
    const imagen = await cargarImagen(urlImagen, "Fotografía aleatoria de un gato");
    contenedor.replaceChildren(imagen);
  } catch (error) {
    console.error(error);
    mostrarError(contenedor, "No se pudo mostrar el gato. Revisa tu conexión e intenta de nuevo.");
  } finally {
    boton.disabled = false;
  }
}

async function actualizarDato() {
  const contenedor = document.getElementById("dato-contenido");
  const boton = document.getElementById("dato-boton");
  mostrarCargando(contenedor, boton);
  try {
    const texto = await obtenerDatoCurioso();
    contenedor.replaceChildren(crearElemento("p", "fact-text", texto));
  } catch (error) {
    console.error(error);
    mostrarError(contenedor, "No se pudo obtener el dato curioso. Revisa tu conexión e intenta de nuevo.");
  } finally {
    boton.disabled = false;
  }
}

// ---------- Inicio ----------

document.getElementById("cita-boton").addEventListener("click", actualizarCita);
document.getElementById("perro-boton").addEventListener("click", actualizarPerro);
document.getElementById("gato-boton").addEventListener("click", actualizarGato);
document.getElementById("dato-boton").addEventListener("click", actualizarDato);

// Las cuatro secciones cargan de forma independiente al entrar.
actualizarCita();
actualizarPerro();
actualizarGato();
actualizarDato();
