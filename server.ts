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
- Cervezas: Corona 330ml ($5.000), Corona 710ml ($8.000), Stella Artois 473ml ($4.000).
- Aperitivos & Vinos.
`;

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
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "El mensaje es obligatorio" });
      }

      const client = getAIClient();

      if (!client) {
        // Fallback local smart assistant Búnker Bot if GEMINI_API_KEY is not set
        const lower = message.toLowerCase();
        let replyText = "";
        let itemIds: string[] = [];
        let whatsappUrl = "";

        // Check if user is confirming or providing order details
        const isOrdering = lower.includes("pedido") || lower.includes("quiero pedir") || lower.includes("mesa") || lower.includes("nombre") || lower.includes("pago") || lower.includes("efectivo") || lower.includes("transferencia") || lower.includes("tarjeta");

        if (lower.includes("confirmar") || (lower.includes("nombre:") && lower.includes("pago:"))) {
          // Build WhatsApp link
          const matchName = message.match(/nombre[:\s]+([^\n,-]+)/i);
          const matchLocation = message.match(/(?:mesa|ubicaci[oó]n|direcci[oó]n)[:\s]+([^\n,-]+)/i);
          const matchPayment = message.match(/(?:pago|m[eé]todo)[:\s]+([^\n,-]+)/i);

          const nombre = matchName ? matchName[1].trim() : "Cliente Casa Búnker";
          const ubicacion = matchLocation ? matchLocation[1].trim() : "Mesa a confirmar";
          const pago = matchPayment ? matchPayment[1].trim() : "Efectivo / Transferencia";
          const detalle = "1x Alito Formoseño ($30.000) + 2x Pinta IPA 473ml ($10.000)";

          whatsappUrl = `https://wa.me/5493510000000?text=Hola%20Casa%20Búnker,%20quiero%20confirmar%20mi%20pedido:%0A%0A-Nombre:%20${encodeURIComponent(nombre)}%0A-Pedido:%20${encodeURIComponent(detalle)}%0A-Ubicación:%20${encodeURIComponent(ubicacion)}%0A-Pago:%20${encodeURIComponent(pago)}`;

          replyText = `¡Excelente, ${nombre}! Ya tengo tu pedido listo para enviar a la cocina y barra:\n\n📋 **Resumen de Pedido:**\n• **Nombre:** ${nombre}\n• **Pedido:** ${detalle}\n• **Ubicación:** ${ubicacion}\n• **Pago:** ${pago}\n\nHacé clic en el siguiente enlace o en el botón para enviarlo directo a nuestro WhatsApp:\n${whatsappUrl}`;
          itemIds = ["alito-formoseno-completo", "pinta-ipa-473"];
        } else if (lower.includes("café") || lower.includes("cafe") || lower.includes("espresso") || lower.includes("americano") || lower.includes("flat white") || lower.includes("capuccino")) {
          // Rule 1: Cafe -> Sugerir algo dulce / pasteleria
          replyText = "¡Qué hacés! Si vas por un rico **Café Espresso ($3.000)**, **Flat White ($4.500)** o un **Nutella Latte ($5.600)**, te sugiero maridarlo con algo dulce como nuestro **Croissant Pistacho ($7.000)**, el **Alfajor de Chocolate, DDL y Frutos Rojos ($4.800)** o un **Roll de Canela ($5.200)**. ¡El contraste de sabores queda espectacular! ¿Querés que te sume alguno?";
          itemIds = ["cafe-flat-white", "dulce-croissant-pistacho", "alfajor-choco-ddl-frutos-rojos", "roll-canela"];
        } else if (lower.includes("cerveza") || lower.includes("birra") || lower.includes("pinta") || lower.includes("ipa") || lower.includes("happy hour")) {
          // Rule 1: Cerveza -> Sugerir papas o picada / especial
          replyText = "¡Tremenda elección! Para acompañar una **Pinta IPA 473ml ($5.000)** o aprovechar la **Promo Happy Hour Pintas x 3 ($10.000)**, te recomiendo maridarla sí o sí con nuestras **Papas con Cheddar y Verdeo ($10.000)**, una **Picada para 2 personas ($27.000)** o el imperdible **Alito Formoseño ($30.000)**. ¿Te sumo alguna?";
          itemIds = ["pinta-ipa-473", "hh-pintas-x3", "papas-cheddar-verdeo", "picada-2-personas", "alito-formoseno-completo"];
        } else if (lower.includes("alito") || lower.includes("formoseño") || lower.includes("lomo") || lower.includes("especial")) {
          // Especial de la casa -> alito formoseño
          replyText = "¡El **Alito Formoseño con papas McCain ($30.000)** es la estrella absoluta de la casa para compartir (o 1/2 porción a $18.000)! Pan de miga, bife de lomo tierno, jamón, queso, huevo y papas fritas. Queda tremendo maridado con una **Pinta Honey ($5.000)** o un **Fernet con Coca ($5.000)**.";
          itemIds = ["alito-formoseno-completo", "alito-formoseno-medio", "pinta-honey-473", "trago-fernet-coca"];
        } else if (lower.includes("pizza") || lower.includes("muzzarella") || lower.includes("napolitana")) {
          replyText = "¡Nuestras pizzas a la piedra son una bomba! Probá la de **Jamón Crudo y Rúcula ($18.000)**, la de **4 Quesos ($18.000)** o aprovechá la **Promo Pizza + 2 Pintas ($22.000)**. Te sugiero maridarlas con una **Pinta Amber ($5.000)** o una copa de **La Linda Malbec ($16.000)**.";
          itemIds = ["promo-pizza-2-pintas", "pizza-jamon-crudo-rucula", "pizza-4-quesos", "pinta-amber-473"];
        } else if (lower.includes("papa") || lower.includes("picada")) {
          replyText = "Nuestras **Papas con Cheddar y Verdeo ($10.000)** y la **Picada para 2 personas ($27.000)** vienen súper completas. Te sugiero maridarlas con una **Pinta IPA ($5.000)** o un **Gin Tonic ($6.000)**.";
          itemIds = ["papas-cheddar-verdeo", "picada-2-personas", "pinta-ipa-473", "trago-gin-tonic"];
        } else if (lower.includes("jugo") || lower.includes("sin alcohol") || lower.includes("limonada") || lower.includes("fresco")) {
          replyText = "¡Nuestros jugos 100% naturales son exprimidos al momento! Probá el **Jugo de Naranja 500ml ($4.000)** o la **Limonada con Jengibre y Menta ($4.000)**. Quedan geniales con el **Avocado Toast ($7.000)** o el **Wrap de Pollo ($12.000)**.";
          itemIds = ["jugo-limon-jengibre-500", "jugo-naranja-500", "avocado-toast", "wrap-pollo"];
        } else {
          // Default greeting
          replyText = "¡Hola! Soy **Búnker Bot**, el mozo virtual de Casa Búnker. ☕🥪🍺🍕\n\nTe puedo recomendar los mejores platos y maridajes de nuestra nueva carta completa (por ejemplo: con café te sugiero croissants rellenos o alfajores de autor, y con birra te recomiendo el Alito Formoseño, papas con cheddar o picadas).\n\nCuando tengas tu elección, solo pasame tu **Nombre**, **Ubicación (Mesa o Dirección)** y **Método de Pago** (Efectivo, Transferencia o Tarjeta) y te preparo el pedido directo para WhatsApp.";
          itemIds = ["alito-formoseno-completo", "papas-cheddar-verdeo", "pinta-ipa-473", "cafe-flat-white"];
        }

        return res.json({
          reply: replyText,
          suggestedItemIds: itemIds,
          whatsappUrl: whatsappUrl || undefined,
        });
      }

      // Gemini AI System Instruction with exact rules and menu
      const systemInstruction = `
Eres "Búnker Bot", el mozo virtual y asistente gastronómico exclusivo de Casa Búnker (Bar & Café), ubicado en Poeta Lugones 412, Nueva Córdoba, Córdoba, Argentina.
Tu objetivo es atender a los clientes de forma cercana, educada, eficiente y con la calidez típica cordobesa de un bar boutique ("¡Qué hacés!", "De una", "Te recomiendo", "La rompe", "Está tremendo").

CARTA Y MENÚ OFICIAL COMPLETO DE CASA BÚNKER:
${MENU_CONTEXT}

REGLAS DE ATENCIÓN OBLIGATORIAS:
1. Recomienda platos de la carta proponiendo maridajes acertados (ej. si el cliente pide café, sugiere algo dulce como croissant de pistacho, alfajor artesanal, minicake de lemon pie o lingote chocotorta; si pide cerveza, recomienda las Papas con cheddar y verdeo, las picadas o el Alito Formoseño; si pide tostadas o brunch, sugiere café de especialidad o limonada natural).
2. Cuando el cliente elija sus productos o exprese que quiere pedir, solicita amablemente sus 3 datos:
   - Nombre
   - Ubicación (Número de Mesa en el local o Dirección de Delivery)
   - Método de pago (Efectivo, Transferencia o Tarjeta)
3. Al confirmar los datos del pedido (o cuando el cliente los brinde), genera un resumen claro y el enlace listo para enviar a WhatsApp con la siguiente estructura exacta:
https://wa.me/5493510000000?text=Hola%20Casa%20Búnker,%20quiero%20confirmar%20mi%20pedido:%0A%0A-Nombre:%20[Nombre]%0A-Pedido:%20[Detalle]%0A-Ubicación:%20[Mesa/Dirección]%0A-Pago:%20[Pago]
(Reemplaza [Nombre], [Detalle], [Mesa/Dirección] y [Pago] con los valores correspondientes codificados en URL).

FORMATO DE PRODUCTOS SUGERIDOS:
Al final de tu respuesta, si recomendaste productos específicos, incluye la etiqueta:
[RECOMMENDED_IDS: "id1", "id2"] con los IDs exactos de la carta.
`;

      // Format conversation contents for Gemini
      let contents: any = [];
      if (Array.isArray(history) && history.length > 0) {
        contents = history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        }));
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
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

      // Check if WhatsApp link is generated in the text
      const waMatch = cleanedText.match(/https:\/\/wa\.me\/5493510000000\?text=[^\s\n\)]+/i);
      const whatsappUrl = waMatch ? waMatch[0] : undefined;

      res.json({
        reply: cleanedText,
        suggestedItemIds: recommendedIds,
        whatsappUrl: whatsappUrl,
      });
    } catch (err: any) {
      console.error("Error en Búnker Bot:", err);
      res.status(500).json({
        reply:
          "¡Hola che! Soy **Búnker Bot**. Justo hay mucho movimiento en el local, pero te recomiendo probar nuestra **Búnker Double ($6.500)** con una **Cerveza Artesanal Pint 500ml ($2.800)** o la **Tabla de Papas Búnker ($4.200)**. ¿Querés que te tome el pedido?",
        suggestedItemIds: ["burger-bunker-double", "papas-tabla-bunker", "cerveza-artesanal-pinta-500"],
      });
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
