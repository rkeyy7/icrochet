export const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const WHATSAPP_NUMERO = "573242848867";

export function urlWhatsApp(nombreProducto: string): string {
  const mensaje = encodeURIComponent(
    `¡Hola! Me encantó el producto ${nombreProducto}. ¿Qué disponibilidad tienen?`
  );
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
}
