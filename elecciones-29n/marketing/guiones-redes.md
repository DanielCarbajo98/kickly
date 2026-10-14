# Kit para redes: Partidómetro (29N)

Imágenes en `marketing/redes/` (1080×1350 para el feed y 1080×1920 para stories). Para regenerarlas con datos nuevos: `NODE_PATH=$(npm root -g) node tools/social.mjs`.

## Reglas de oro
1. **Neutralidad siempre.** Nunca digas a quién votar ni te burles de un partido. Si pareces partidista, te denuncian y pierdes a la mitad de la audiencia.
2. **Sin publicidad de pago.** En la UE, Meta y TikTok no permiten promocionar contenido político. Todo el crecimiento es orgánico.
3. **La cara vende.** Las imágenes sirven como apoyo. Lo que se viraliza en TikTok y Reels es una persona hablando a cámara, aunque solo sea su voz.
4. **Constancia:** 1–2 vídeos al día durante 6 semanas. Mide las visitas desde redes en las estadísticas de Cloudflare. Si en 2 semanas no hay tráfico, cambia de formato o abandona.
5. **Enlace en la bio:** `partidometro.es`. En TikTok, menciona "link en mi perfil".
6. **Del 24 al 29 de noviembre no se publican encuestas.** No subas la imagen de encuestas esos días.

## Carruseles de Instagram (listos)
- **Carrusel "Qué opina cada partido de…":** `00-portada` + 3 o 4 temas (`01…10`) + `99-cierre`. Haz uno nuevo cada 2–3 días con temas distintos.
- **"¿Quién va ganando?":** `20-encuestas-media`. Actualízalo cuando salgan encuestas nuevas.
- **Utilidad pura:** `30-mesa-electoral` (sale a partir del sorteo, del 31 de octubre al 4 de noviembre) y `31-voto-por-correo` (antes del 19 de noviembre).
- **Stories:** `40-story-haz-el-test` con el sticker de enlace.

Texto base para el pie:
> ¿Sabes qué opina cada partido de [tema]? Lo hemos resumido sin opinión, con fuentes. ¿Y tú con quién coincides? Haz el test gratis (link en bio) 🗳️
> #elecciones2026 #29N #eleccionesgenerales #aquienvotar #testpolitico #politicaespañola

## 10 guiones de vídeo de 30 segundos (TikTok, Reels y Shorts)

**1. "Hice el test y me sorprendió"**
- **Gancho (0–3 s):** "Creía que era de [X] y el test me ha dicho otra cosa."
- **Cuerpo:** graba la pantalla haciendo 3–4 preguntas en voz alta y enseña la tarjeta de resultado.
- **Cierre:** "Hazlo tú y dime en comentarios qué te sale. Link en mi perfil."

**2. Gente en la calle (el formato más viral)**
- **Gancho:** "¿Sabes a quién vas a votar el 29N?"
- **Cuerpo:** 3–4 personas hacen el test rápido en tu móvil y reaccionan al resultado.
- **Cierre:** "¿Y tú? Partidómetro punto es." Pide permiso para grabar y publicar.

**3. "¿Qué opina cada partido de…?"**
- **Gancho:** "El alquiler está imposible. ¿Qué proponen los partidos?"
- **Cuerpo:** pantalla con la imagen `01-tema-alquiler-tope` y tu voz explicando a favor y en contra, sin opinar.
- **Cierre:** "¿Tú qué piensas? El test te dice con quién coincides."

**4. "Lo que nadie te explica: cómo se reparten los escaños"**
- **Cuerpo:** ley D'Hondt en 20 segundos y por qué tu voto vale distinto según la provincia.
- **Cierre:** "Más guías en partidometro.es."

**5. "Te ha tocado mesa, ¿y ahora qué?"**
- **Cuándo:** publícalo del 31 de octubre al 4 de noviembre.
- **Cuerpo:** 75 €, permiso laboral, cómo librarte y la multa. Usa la imagen `30-mesa-electoral`.

**6. "Voto por correo: no te pases de fecha"**
- **Cuerpo:** pedirlo hasta el 19 de noviembre y entregarlo hasta el 25. Imagen `31`.

**7. "Lo más polémico del 29N en 30 segundos"**
- **Cuerpo:** 3 temas (okupas, regularización, Cataluña) mostrando qué partidos están a favor y en contra.
- **Cierre:** "¿Con cuál estás tú? Test en el link."

**8. "Reto: adivina el partido"**
- **Cuerpo:** lee una propuesta real ("IRPF del 0% hasta 35.000 €") y pregunta de quién es. Revela la respuesta en el segundo 20.
- **Por qué funciona:** genera muchos comentarios.

**9. "Encuestas de la semana"**
- **Cuerpo:** imagen `20-encuestas-media` y un resumen neutral.
- **Fechas:** solo hasta el 23 de noviembre.

**10. "Parejas/amigos hacen el test"**
- **Cuerpo:** dos personas que discuten de política hacen el test y comparan sus tarjetas.
- **Cierre:** "Etiqueta a con quién lo harías."

## Calendario sugerido
| Semana | Foco |
|---|---|
| 15–31 oct | Guiones 1, 3, 8 y carruseles de temas |
| 31 oct–4 nov | Mesa electoral (guion 5) y encuestas |
| 5–19 nov | Voto por correo (guion 6), gente en la calle (guion 2), debates |
| 13–23 nov | Campaña: un tema por día, encuestas semanales |
| 24–28 nov | **Sin encuestas.** Test, "último día para decidir", parejas (guion 10) |
| 29 nov | "Hoy se vota: 3 minutos para decidir" y guía de cómo votar |
