# Portafolio · Matías Fuentes Mora

## Abrirlo
Sitio estático (HTML + CSS + JS, sin build): doble clic en `index.html`. Opcional, con servidor local: `python3 -m http.server` y abrir `http://localhost:8000`.

## Editar contenido
Todo el texto y los enlaces están en `index.html`. Busca `EDITAR` para ver cada punto editable
y `COMPLETAR` para ver los datos que faltan.

## Fuentes, tamaños y colores
Todo está en el bloque `:root` al inicio de `css/style.css`:
- **Colores:** `--color-bg`, `--color-bg-alt` (tono de Educación y Contacto), `--color-text`, `--color-accent`.
- **Tamaños:** `--size-h1` (nombre), `--size-h2` (títulos de sección), `--size-body`, `--space-section`.
- **Fuentes:** elige en fonts.google.com, reemplaza el `<link>` de Google Fonts en `index.html`
  y escribe el nombre en `--font-title`, `--font-body` o `--font-mono` (detalles técnicos).

## Imágenes
Guárdalas en `assets/` con nombres claros y actualiza el `src` en `index.html`:
- `assets/images/` → `foto-perfil.jpg` (se recorta en círculo; encuadre con `object-position` en `.hero-photo`),
  `proyecto-nombre.jpg` (16:9). Usa fotos de menos de ~300 KB para que cargue rápido.
- `assets/logos/` → logos de instituciones.
- `assets/cv/cv.pdf` → tu CV (mismo nombre, no hay que tocar el HTML).

Los `.svg` actuales son marcadores de posición; al reemplazarlos cambia también la extensión en el `src`.

## Agregar un proyecto o una etapa de educación
En `index.html`, copia un bloque completo `<li class="project scroll-item"> ... </li>` (o
`<li class="timeline-item scroll-item"> ... </li>`), pégalo debajo del último y cambia sus datos.
La línea de tiempo alterna los lados sola.
