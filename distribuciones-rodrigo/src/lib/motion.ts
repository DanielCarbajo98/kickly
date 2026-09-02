import type { Variants, Transition } from "motion/react";

/** Curva de salida: rápida al principio, se posa al final. */
export const salida: Transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] };
export const salidaCorta: Transition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

/** Aparición estándar de un bloque al entrar en pantalla. */
export const aparece: Variants = {
  oculto: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: salida },
};

/** Contenedor que escalona la entrada de sus hijos. */
export const escalona = (retardo = 0.06, inicial = 0): Variants => ({
  oculto: {},
  visible: { transition: { staggerChildren: retardo, delayChildren: inicial } },
});

/** Línea de titular que sube tras una máscara. */
export const lineaTitular: Variants = {
  oculto: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

/** Opciones habituales de `whileInView`. */
export const enVista = { once: true, amount: 0.25 } as const;
