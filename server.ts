import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy GenAI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const MENU_CONTEXT = `
CASA BÚNKER (Bar & Café) - Poeta Lugones 412, Nueva Córdoba, Córdoba, Argentina.
Carta & Precios Oficiales en Pesos Argentinos (ARS):

1. HAPPY HOUR & PROMOS:
- Pintas, tragos y combos:
  * Happy Hour Pintas x 3 (3 pintas de 473ml a elección) - $10.000 [ID: hh-pintas-x3]
  * Happy Hour Tragos x 3 (3 tragos de la carta clásica) - $12.000 [ID: hh-tragos-x3]
  * Promo Pinta x 3 (3 pintas de 473ml a elección) - $12.000 [ID: promo-pinta-x3]
  * Promo Tragos x 3 (3 tragos de la carta clásica) - $15.000 [ID: promo-tragos-x3]
  * Promo Fernet 750 ml + 2 Coca 1.25 l (Botella con hielo) - $45.000 [ID: promo-fernet-750-2coca]
  * Balde de Coronas 710ml x 4 (Hielo y rodajas de limón) - $30.000 [ID: promo-balde-coronas-710]
  * Picada para 2 más 2 Pintas - $31.000 [ID: promo-picada-2-mas-2-pintas]
  * Picada para 4 más 4 Pintas - $58.000 [ID: promo-picada-4-mas-4-pintas]
  * Promo 2 Pizzas (A elección) - $29.000 [ID: promo-2-pizzas]
  * Promo Pizza + 2 Pintas - $22.000 [ID: promo-pizza-2-pintas]
  * Promo 2 Pizzas + 4 Pintas - $37.000 [ID: promo-2-pizzas-4-pintas]
  * Promo Café + Medialuna o Croissant - $6.500 [ID: promo-cafe-medialuna-croissant]

2. CAFETERÍA:
- Clásicos:
  * Espresso ($3.000) [ID: cafe-espresso]
  * Americano ($3.800) [ID: cafe-americano]
  * Doppio ($3.800) [ID: cafe-doppio]
  * Cortadito ($4.000) [ID: cafe-cortadito]
  * Flat White ($4.500) [ID: cafe-flat-white]
  * Capuccino ($4.800) [ID: cafe-capuccino]
  * Latte ($4.300) [ID: cafe-latte]
- Especiales:
  * Mocaccino ($5.000) [ID: cafe-mocaccino]
  * Submarino ($4.500) [ID: cafe-submarino]
  * Matcha Latte ($5.500) [ID: cafe-matcha-latte]
  * Caramel Macchiato ($5.000) [ID: cafe-caramel-macchiato]
  * Espresso Tonic ($5.200) [ID: cafe-espresso-tonic]
  * Darkmallow ($5.500) [ID: cafe-darkmallow]
  * Nutella Latte ($5.600) [ID: cafe-nutella-latte]
- Otras Infusiones:
  * Mate Cocido ($3.000) [ID: infusion-mate-cocido]
  * Té Negro Orgánico ($4.500) [ID: infusion-te-negro-organico]
  * Té Verde Orgánico ($4.500) [ID: infusion-te-verde-organico]

3. ACOMPAÑAMIENTOS DULCES:
- Medialunas & Croissants: Medialuna ($3.400), Croissant ($3.400), Croissant Pistacho ($7.000), Croissant Frutos Rojos ($7.000), Croissant Bonobon ($7.000), Croissant Nutella ($7.000).
- Cookies: Cookie Oreo ($5.200), Cookie Manjar ($5.200), Cookie Red Velvet ($5.200), Cookie Pistacho ($5.200).
- Alfajores: Alfajor Pistacho ($4.800), Alfajor Maní ($4.800), Alfajor Chocolate, DDL y Frutos Rojos ($4.800).
- Minicakes & Lingotes: Minicake de Ganache ($8.000), Minicake de Ricota ($8.000), Minicake de Lemon Pie ($8.000), Lingote de Chocotorta ($8.000), Lingote de Selva Negra ($8.000).
- Budines: Porción Budín Banana ($4.200), Porción Budín Limón y Arándanos ($4.200), Porción Budín Carrot Cake ($4.200).
- Rolls & Más: Roll de Canela ($5.200), Roll de Chocolate ($4.600), Al Vuelo ($7.000).

4. SALADOS & BRUNCH:
- Tostadas: Tostado Jamón y Queso ($7.000), Tostado Jamón Crudo ($9.000), Jamón Crudo Toast ($7.000), Tostadas + 2 Dips ($4.000), Tostadas con Huevo y Palta ($4.500).
- Croissants: Croissant Mafalda ($7.000), Croissant Jamón Crudo ($8.000), Croissant Avocado ($7.000).
- Avocados: Avocado Toast ($7.000).
- Keto: Plato Keto ($7.000 - sin TACC).
- Americano Completo: Americano Completo ($9.000).

5. ESPECIAL DE LA CASA:
- Alito Formoseño con papas McCain (para compartir) ($30.000) [ID: alito-formoseno-completo]
- 1/2 Alito Formoseño con papas McCain ($18.000) [ID: alito-formoseno-medio]

6. ALMUERZOS:
- Wraps: Wrap de Atún ($13.000), Wrap de Pollo ($12.000).
- Ensaladas: Ensalada César ($9.000), Ensalada de Atún ($12.000).
- Pollo: Pollo con Guarnición ($12.000).
- Sandwiches: Club Sandwich ($13.000).

7. PAPAS Y PICADAS:
- Papas Fritas: Papas Regulares ($8.000), Papas con Cheddar y Verdeo ($10.000).
- Picadas: Picada para 2 personas ($27.000), Picada para 4 personas ($50.000).

8. PIZZAS:
- Masa de la casa: Muzzarella ($15.000), Napolitana ($15.000), Especial ($18.000), 4 Quesos ($18.000), Jamón Crudo y Rúcula ($18.000), Pepperoni ($18.000).

9. CERVEZAS TIRADAS & TRAGOS:
- Cervezas Tiradas ($5.000): Pinta Pilsen, Pinta IPA, Pinta Red, Pinta Honey, Pinta Amber, Pinta Barley, Pinta Stout, Pinta Neipa.
- Tragos: Fernet con Coca ($5.000), Gin Tonic ($6.000), Aperol Spritz ($6.000), Campari Tonic ($5.500), Vermut de la Casa ($5.000).
- Vinos: Norton Cosecha Tardío Blanco ($7.000), Anaia Malbec ($12.000), El Cazador Malbec ($8.000), La Linda Malbec ($16.000), Luigi Bosca Malbec ($25.000), Trumpeter Reserva Malbec ($18.000).

10. BEBIDAS SIN ALCOHOL:
- Jugos: Jugo Naranja 500ml ($4.000), Jarra Naranja 1L ($7.500), Limonada 500ml ($4.000), Jarra Limonada 1L ($7.500).
- Gaseosas: Pepsi, Pepsi Black, Seven Up, Mirinda ($3.000 c/u), Paso de los Toros ($2.000).
- Aguas y Aquarius ($2.000 / $3.000), Energizantes ($4.000), Corona Cero ($4.000).

11. BEBIDAS CON ALCOHOL:
- Cervezas: Corona 330ml ($5.000) [ID: corona-330], Corona 710ml ($8.000) [ID: corona-710], Stella Artois 473ml ($4.000) [ID: stella-artois-473].
`;

const WHATSAPP_PHONE = "5493518725482";

// Helper to build WhatsApp direct link
function buildWhatsAppOrderUrl(params: {
  customerName?: string;
  location?: string;
  payment?: string;
  itemsText?: string;
  total?: number;
}) {
  const name = params.customerName || "Cliente Casa Búnker";
  const location = params.location || "Mesa en local";
  const payment = params.payment || "Efectivo / Transferencia";
  const items = params.itemsText || "• 1x Pedido sugerido por Búnker Bot";
  const totalStr = params.total ? `$ ${params.total.toLocaleString("es-AR")}` : "";

  const lines = [
    `🍻 *PEDIDO - CASA BÚNKER (Bar & Café)*`,
    `📍 *Poeta Lugones 412, Nueva Córdoba*`,
    `─────────────────────────`,
    `👤 *Cliente:* ${name}`,
    `🪑 *Ubicación / Mesa:* ${location}`,
    `💳 *Medio de Pago:* ${payment}`,
    `─────────────────────────`,
    `📋 *DETALLE DEL PEDIDO:*`,
    items,
    `─────────────────────────`,
  ];

  if (totalStr) {
    lines.push(`💰 *TOTAL: ${totalStr}*`);
  }
  lines.push(`✨ _Enviado desde Búnker Bot (Carta Digital)_`);

  const fullText = lines.join("\n");
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(fullText)}`;
}

// Fallback intelligent conversation engine when GEMINI_API_KEY is not configured
function processLocalMozoResponse(message: string, cartItems: any[] = []): {
  reply: string;
  suggestedItemIds: string[];
  whatsappUrl?: string;
} {
  const q = message.toLowerCase().trim();

  // Intent: Finalizar / Confirmar pedido / Enviar WhatsApp
  if (
    q.includes("termin") ||
    q.includes("finaliz") ||
    q.includes("enviar") ||
    q.includes("confirm") ||
    q.includes("cerrar") ||
    q.includes("la cuenta") ||
    q.includes("pagar") ||
    q.includes("whatsapp")
  ) {
    let itemsDetail = "";
    let total = 0;

    if (cartItems && cartItems.length > 0) {
      itemsDetail = cartItems
        .map((i: any) => `• *${i.cantidad}x* ${i.nombre} ($${(i.precioTotal || i.precioUnitario * i.cantidad).toLocaleString("es-AR")})`)
        .join("\n");
      total = cartItems.reduce((acc: number, i: any) => acc + (i.precioTotal || i.precioUnitario * i.cantidad), 0);
    } else {
      itemsDetail = "• *1x* Alito Formoseño con papas McCain ($30.000)\n• *2x* Pinta IPA 473ml ($10.000)";
      total = 40000;
    }

    const waUrl = buildWhatsAppOrderUrl({
      itemsText: itemsDetail,
      total: total,
    });

    return {
      reply: `¡De una! Ya preparé el resumen de tu pedido. 📋\n\n${itemsDetail}\n\n💰 **Total: $ ${total.toLocaleString("es-AR")}**\n\nHacé clic en el botón de abajo para enviarlo directo a nuestra barra y cocina por WhatsApp:`,
      suggestedItemIds: ["alito-formoseno-completo", "pinta-ipa-473"],
      whatsappUrl: waUrl,
    };
  }

  // Intent: Dulces, postres, pastelería, croissant, merienda
  if (
    q.includes("dulce") ||
    q.includes("croissant") ||
    q.includes("pistacho") ||
    q.includes("nutella") ||
    q.includes("alfajor") ||
    q.includes("torta") ||
    q.includes("lingote") ||
    q.includes("cookie") ||
    q.includes("merienda")
  ) {
    return {
      reply:
        "¡Para algo dulce tenemos opciones increíbles! 🥐🍫 Te recomiendo fuerte la **Croissant de Pistacho ($7.000)** o la de **Nutella ($7.000)**, que son súper hojaldradas y rellenas en el momento. También tenés el **Lingote de Chocotorta ($8.000)** y nuestro **Alfajor de Chocolate, DDL y Frutos Rojos ($4.800)**. Maridan perfecto con un Flat White o Capuccino. ¿Te sumo alguno?",
      suggestedItemIds: [
        "dulce-croissant-pistacho",
        "dulce-croissant-nutella",
        "lingote-chocotorta",
        "alfajor-choco-ddl-frutos-rojos",
      ],
    };
  }

  // Intent: Cafetería, café de especialidad
  if (
    q.includes("café") ||
    q.includes("cafe") ||
    q.includes("flat white") ||
    q.includes("capuccino") ||
    q.includes("latte") ||
    q.includes("espresso") ||
    q.includes("desayun")
  ) {
    return {
      reply:
        "¡Excelente! Nuestro café de especialidad sale a punto perfecto. ☕ Te recomiendo un **Flat White ($4.500)** con doble shot de espresso y leche texturizada, o un **Nutella Latte ($5.600)** si te gusta con un toque dulce. Para acompañar, podés sumar una **Croissant Clásica ($3.400)** o un **Tostado de Jamón y Queso ($7.000)**.",
      suggestedItemIds: [
        "cafe-flat-white",
        "cafe-nutella-latte",
        "dulce-croissant-clasico",
        "tostado-jamon-queso",
      ],
    };
  }

  // Intent: Cerveza artesanal, birra, noche, pintas, IPA, Honey
  if (
    q.includes("cerveza") ||
    q.includes("birra") ||
    q.includes("pinta") ||
    q.includes("ipa") ||
    q.includes("honey") ||
    q.includes("stout") ||
    q.includes("noche") ||
    q.includes("previa")
  ) {
    return {
      reply:
        "¡Qué buena hora para una birra tirada! 🍺 Nuestras estrellas son la **Pinta IPA ($5.000)** y la **Pinta Honey ($5.000)**. Si vienen en grupo, sale como piña la **Promo Happy Hour Pintas x 3 ($10.000)**. Para picar algo, no falla la **Picada para 2 personas ($27.000)** o las **Papas con Cheddar y Verdeo ($10.000)**.",
      suggestedItemIds: [
        "pinta-ipa-473",
        "pinta-honey-473",
        "hh-pintas-x3",
        "papas-cheddar-verdeo",
      ],
    };
  }

  // Intent: Alito Formoseño / Especial de la casa
  if (
    q.includes("alito") ||
    q.includes("formoseño") ||
    q.includes("especial") ||
    q.includes("lomo") ||
    q.includes("para compartir")
  ) {
    return {
      reply:
        "¡El **Alito Formoseño con papas McCain ($30.000)** es el plato insignia indiscutido de Casa Búnker! 🥩🔥 Viene con pan de miga tostado, bife de lomo premium, jamón, queso, huevo y papas crocantes (ideal para compartir entre 2 o 3). También tenemos la 1/2 porción a **$18.000**. Marida genial con una Pinta IPA o Fernet con Coca.",
      suggestedItemIds: [
        "alito-formoseno-completo",
        "alito-formoseno-medio",
        "pinta-ipa-473",
        "trago-fernet-coca",
      ],
    };
  }

  // Intent: Papas y picadas
  if (q.includes("papa") || q.includes("picada") || q.includes("cheddar") || q.includes("tabla")) {
    return {
      reply:
        "¡Nuestras picadas y papas son un diez! 🍟🧀 La **Picada para 2 ($27.000)** trae variedad de quesos, fiambres, frutos secos, aceitunas y pan artesanal. Y las **Papas con Cheddar y Verdeo ($10.000)** vienen con abundante queso fundido y crocante de verdeo.",
      suggestedItemIds: [
        "papas-cheddar-verdeo",
        "picada-2-personas",
        "promo-picada-2-mas-2-pintas",
      ],
    };
  }

  // Intent: Pizzas
  if (q.includes("pizza") || q.includes("muzzarella") || q.includes("fugazzeta") || q.includes("rucula")) {
    return {
      reply:
        "¡Nuestras pizzas de masa madre a la piedra son imperdibles! 🍕 Te sugiero la de **Jamón Crudo y Rúcula ($18.000)** o la de **4 Quesos ($18.000)**. Si son varios, aprovechen la **Promo 2 Pizzas por $29.000** o la **Promo Pizza + 2 Pintas ($22.000)**.",
      suggestedItemIds: [
        "pizza-jamon-crudo-rucula",
        "pizza-4-quesos",
        "promo-pizza-2-pintas",
        "promo-2-pizzas",
      ],
    };
  }

  // Intent: Promos / Happy Hour
  if (q.includes("promo") || q.includes("descuento") || q.includes("oferta") || q.includes("barato")) {
    return {
      reply:
        "¡Tenemos promos buenísimas hoy! 🔥\n• **Happy Hour Pintas x 3:** $10.000\n• **Promo Pizza + 2 Pintas:** $22.000\n• **Picada para 2 + 2 Pintas:** $31.000\n• **Botella Fernet 750ml + 2 Coca 1.25L:** $45.000\n• **Promo Café + Medialuna:** $6.500\n\n¿Cuál te tienta más?",
      suggestedItemIds: [
        "hh-pintas-x3",
        "promo-pizza-2-pintas",
        "promo-picada-2-mas-2-pintas",
        "promo-fernet-750-2coca",
      ],
    };
  }

  // Intent: Tragos / Fernet / Gin / Cócteles
  if (q.includes("trago") || q.includes("fernet") || q.includes("gin") || q.includes("aperol") || q.includes("campari")) {
    return {
      reply:
        "¡En coctelería tenemos los mejores clásicos! 🍸 El infaltable **Fernet con Coca ($5.000)** servido bien frío en vaso copón, el **Gin Tonic ($6.000)** con botánicos premium, y el refrescante **Aperol Spritz ($6.000)**. También tenés la **Promo 3 Tragos por $15.000**.",
      suggestedItemIds: [
        "trago-fernet-coca",
        "trago-gin-tonic",
        "trago-aperol-spritz",
        "promo-tragos-x3",
      ],
    };
  }

  // Intent: Saludable, Keto, Ensaladas, Sin TACC
  if (q.includes("keto") || q.includes("saludable") || q.includes("ensalada") || q.includes("light") || q.includes("tacc")) {
    return {
      reply:
        "¡Sí! Tenemos opciones frescas y saludables: el **Plato Keto ($7.000)** con huevos, palta y queso (sin harinas), el **Avocado Toast ($7.000)** y la **Ensalada César ($9.000)** con pollo grillado y aderezo casero.",
      suggestedItemIds: [
        "plato-keto",
        "avocado-toast",
        "ensalada-cesar",
        "wrap-pollo",
      ],
    };
  }

  // Generic dynamic greeting and orientation
  return {
    reply:
      "¡Hola! 👋 Soy **Búnker Bot**, el mozo virtual de Casa Búnker. Te puedo asesorar con toda nuestra carta: desde desayunos y cafés de especialidad ☕ hasta el famoso Alito Formoseño 🥩, pizzas de masa madre 🍕 y cervezas artesanales tiradas 🍺.\n\n¿Buscás algo para comer, para tomar o alguna promo para compartir?",
    suggestedItemIds: [
      "alito-formoseno-completo",
      "pinta-ipa-473",
      "cafe-flat-white",
      "dulce-croissant-pistacho",
    ],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "CASA BÚNKER (Bar & Café) - Búnker Bot" });
  });

  // Mozo IA (Búnker Bot) API endpoint
  app.post("/api/mozo-ia", async (req, res) => {
    try {
      const { message, history, cartItems, orderDetails } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "El mensaje es obligatorio" });
      }

      const client = getAIClient();

      if (!client) {
        // Fallback local dynamic logic
        const localRes = processLocalMozoResponse(message, cartItems);
        return res.json(localRes);
      }

      // Format cart context if user has items selected
      let cartContextStr = "CARRITO ACTUAL DEL CLIENTE:\n";
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        cartContextStr += cartItems
          .map((i: any) => `- ${i.cantidad}x ${i.nombre} ($${i.precioTotal || i.precioUnitario * i.cantidad})`)
          .join("\n");
        const tot = cartItems.reduce((acc: number, i: any) => acc + (i.precioTotal || i.precioUnitario * i.cantidad), 0);
        cartContextStr += `\nTotal acumulado: $${tot.toLocaleString("es-AR")}\n`;
      } else {
        cartContextStr += "El carrito está actualmente vacío.\n";
      }

      if (orderDetails) {
        cartContextStr += `Cliente: ${orderDetails.customerName || "No especificado"}, Mesa/Ubicación: ${orderDetails.tableNumber || orderDetails.address || "En mesa"}, Pago: ${orderDetails.paymentMethod || "Efectivo"}\n`;
      }

      // Gemini AI System Instruction
      const systemInstruction = `
Eres "Búnker Bot", el mozo virtual experto y amigable de Casa Búnker (Bar & Café, ubicado en Poeta Lugones 412, Nueva Córdoba). Tu tono es cálido, canchero pero muy educado, servicial y eficiente, reflejando la identidad de un bar exclusivo pero relajado.

Tu objetivo es ayudar a los clientes a explorar la carta digital, recomendarles opciones según sus gustos, responder dudas sobre ingredientes y guiarlos para que realicen su pedido o reserva de la mejor manera.

Reglas de Interacción:
1. Conocimiento de la Carta: Conoces a la perfección todas las categorías: Happy Hour & Promos, Cafetería, Acompañamientos Dulces, Salados & Brunch, Especiales de la casa (como el Alito Formoseño), Almuerzos, Papas y Picadas, Pizzas de masa madre, Cervezas tiradas, Tragos, Vinos y Bebidas.
2. Recomendaciones Personalizadas: Si un cliente te pide algo dulce, recomiéndale las croissants rellenas (como la de pistacho o Nutella) o los lingotes. Si es de noche, sugiere las pintas artesanales (IPA, Honey, Stout) acompañadas de una picada o una pizza.
3. Venta Consultiva: Si te preguntan por promos, destaca el ahorro y los agregados (por ejemplo, las promos de pizzas con pintas o el Fernet con Coca).
4. Límites: Si te consultan por algo fuera de Casa Búnker o de la atención en el local, redirige amablemente la conversación hacia los productos del menú o los canales de contacto y reservas por WhatsApp (+54 9 351 872-5482).
5. Formato: Usa un lenguaje claro, cercano, acorde al público de Nueva Córdoba, Argentina, y utiliza emojis de forma moderada para hacer la charla más fluida y agradable.

INFORMACIÓN DEL ESTADO ACTUAL:
${cartContextStr}

CARTA Y MENÚ OFICIAL COMPLETO DE CASA BÚNKER:
${MENU_CONTEXT}

INSTRUCCIÓN ESPECIAL DE FINALIZACIÓN:
Si el cliente dice que ya terminó, quiere enviar su pedido o finalizar, redacta un resumen claro y genera el enlace listo para WhatsApp usando el formato:
https://api.whatsapp.com/send?phone=5493518725482&text=... (con el texto codificado en URL con los productos elegidos, total y datos).

FORMATO DE PRODUCTOS RECOMENDADOS:
Al final de tu mensaje, incluye siempre la etiqueta con los IDs de los productos relevantes sugeridos:
[RECOMMENDED_IDS: "id1", "id2"]
`;

      // Format conversation contents for Gemini
      let contents: any = [];
      if (Array.isArray(history) && history.length > 0) {
        contents = history.slice(-6).map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        }));
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || "¡Hola! Soy Búnker Bot. ¿En qué te puedo asesorar hoy de nuestra carta?";

      // Extract recommended IDs
      let cleanedText = rawText;
      let recommendedIds: string[] = [];

      const idMatch = rawText.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);
      if (idMatch) {
        cleanedText = rawText.replace(idMatch[0], "").trim();
        try {
          const rawList = idMatch[1];
          const parsed = rawList
            .split(",")
            .map((s) => s.replace(/['" \n]/g, "").trim())
            .filter(Boolean);
          recommendedIds = parsed;
        } catch {
          // ignore parsing error
        }
      }

      // Check if WhatsApp link is generated in text
      const waMatch = cleanedText.match(/https:\/\/(?:api\.whatsapp\.com\/send\?phone=5493518725482&text=|wa\.me\/5493518725482\?text=)[^\s\n\)]+/i);
      let whatsappUrl = waMatch ? waMatch[0] : undefined;

      // If user clearly wanted to finish and no URL was created, build one automatically
      const lower = message.toLowerCase();
      if (!whatsappUrl && (lower.includes("termin") || lower.includes("finaliz") || lower.includes("enviar pedido") || lower.includes("cerrar"))) {
        let itemsDetail = "";
        let tot = 0;
        if (cartItems && cartItems.length > 0) {
          itemsDetail = cartItems.map((i: any) => `• ${i.cantidad}x ${i.nombre} ($${(i.precioTotal || i.precioUnitario * i.cantidad).toLocaleString("es-AR")})`).join("\n");
          tot = cartItems.reduce((acc: number, i: any) => acc + (i.precioTotal || i.precioUnitario * i.cantidad), 0);
        } else {
          itemsDetail = "• 1x Alito Formoseño con papas McCain ($30.000)\n• 2x Pinta IPA 473ml ($10.000)";
          tot = 40000;
        }
        whatsappUrl = buildWhatsAppOrderUrl({
          customerName: orderDetails?.customerName,
          location: orderDetails?.tableNumber ? `Mesa N° ${orderDetails.tableNumber}` : orderDetails?.address,
          payment: orderDetails?.paymentMethod,
          itemsText: itemsDetail,
          total: tot,
        });
      }

      res.json({
        reply: cleanedText,
        suggestedItemIds: recommendedIds,
        whatsappUrl: whatsappUrl,
      });
    } catch (err: any) {
      console.error("Error en Búnker Bot:", err);
      // Fallback cleanly using local engine rather than static error text
      const fallback = processLocalMozoResponse(req.body.message || "", req.body.cartItems || []);
      res.json(fallback);
    }
  });

  // Vite middleware for development vs static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CASA BÚNKER server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
