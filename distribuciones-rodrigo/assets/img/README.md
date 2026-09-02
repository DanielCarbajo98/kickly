# Imágenes

## Logotipos — PENDIENTE de sustituir

`logo.svg` y `logo-mark.svg` son una **reconstrucción provisional** creada para
poder maquetar el sitio. No son los logotipos oficiales de la marca.

Para dejarlos definitivos:

1. Sustituir `logo-mark.svg` (isotipo cuadrado, viewBox 64×64) y
   `logo.svg` (lockup horizontal) por los originales en SVG.
2. Regenerar `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180×180)
   y `icon-192.png` / `icon-512.png` a partir del isotipo oficial.
3. Ajustar los colores corporativos exactos en `assets/css/style.css`
   (bloque `:root`, variables `--brand-500`, `--brand-600`, `--brand-700`,
   `--brand-100`). Todo el sitio deriva de esas cuatro variables.

El isotipo también está incrustado en línea en la cabecera y el pie de cada
página HTML (busca `<svg class="brand__mark"`), para que cargue sin peticiones
extra. Si se cambia el archivo, cambiar también ese SVG en línea.

## Fotografías — PENDIENTE

El sitio funciona sin fotos (usa degradados y SVG), pero gana mucho con
imágenes reales. Slots previstos, todos con `<img>` comentado en el HTML:

| Archivo sugerido        | Uso                        | Tamaño mínimo | Proporción |
|-------------------------|----------------------------|---------------|------------|
| `hero.jpg`              | Portada, columna derecha   | 1200×1500     | 4:5        |
| `almacen.jpg`           | Empresa · instalaciones    | 1600×1200     | 4:3        |
| `flota.jpg`             | Servicios · reparto        | 1600×1200     | 4:3        |
| `camara-frio.jpg`       | Calidad · cadena de frío   | 1600×1200     | 4:3        |
| `equipo.jpg`            | Empresa · equipo           | 1600×1200     | 4:3        |
| `og.jpg`                | Redes sociales (Open Graph)| 1200×630      | 1.91:1     |

Recomendaciones: formato WebP o JPEG optimizado (< 250 KB), foto propia de la
nave, cámaras, flota y equipo. Evitar banco de imágenes genérico: en este
sector la foto real de las instalaciones es el mejor argumento comercial.
