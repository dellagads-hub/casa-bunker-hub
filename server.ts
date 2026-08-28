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
  * Promo Papas + 2 Pintas - $14.000 [ID: promo-papas-2-pintas]
  * Promo Pizza + 2 Pintas - $22.000 [ID: promo-pizza-2-pintas]
  * Promo 2 Pizzas - $29.000 [ID: promo-2-pizzas]
  * Promo 2 Pizzas + 4 Pintas - $37.000 [ID: promo-2-pizzas-4-pintas]
  * Semana de Pizza - $24.000 [ID: promo-semana-pizza]
  * Picada para 2 más 2 Pintas - $31.000 [ID: promo-picada-2-mas-2-pintas]
  * Picada para 4 más 4 Pintas - $58.000 [ID: promo-picada-4-mas-4-pintas]
  * Promo Fernet 750 ml + 2 Coca 1.25 l - $45.000 [ID: promo-fernet-750-2coca]
  * Promo Fernet 750 ml - $40.000 [ID: promo-fernet-750]
  * Balde de Coronas 710ml x 4 - $30.000 [ID: promo-balde-coronas-710]
  * Promo Café + Medialuna o Croissant - $6.500 [ID: promo-cafe-medialuna-croissant]
  * Promo Infusión - $3.500 [ID: promo-infusion]

2. CAFETERÍA:
- Clásicos:
  * Espresso ($3.000) [ID: cafe-espresso]
  * Doppio ($3.500) [ID: cafe-doppio]
  * Americano ($3.800) [ID: cafe-americano]
  * Cortadito ($4.000) [ID: cafe-cortadito]
  * Flat White ($4.500) [ID: cafe-flat-white]
  * Latte ($4.300) [ID: cafe-latte]
  * Capuccino ($4.800) [ID: cafe-capuccino]
- Especiales:
  * Mocaccino ($5.000) [ID: cafe-mocaccino]
  * Submarino ($4.500) [ID: cafe-submarino]
  * Caramel Macchiato ($5.500) [ID: cafe-caramel-macchiato]
  * Darkmallow ($5.500) [ID: cafe-darkmallow]
  * Espresso Tonic ($5.200) [ID: cafe-espresso-tonic]
  * Ice Coffee ($5.000) [ID: cafe-ice-coffee]
  * Matcha Latte ($5.800) [ID: cafe-matcha-latte]
  * Nutella Latte ($5.600) [ID: cafe-nutella-latte]
  * Chocolatada ($3.000) [ID: cafe-chocolatada]
- Otras Infusiones:
  * Mate Cocido ($3.000) [ID: infusion-mate-cocido]
  * Té Negro Hebras ($4.500) [ID: infusion-te-negro-organico]
  * Té Verde Hebras ($4.500) [ID: infusion-te-verde-organico]

3. ACOMPAÑAMIENTOS DULCES:
- Medialunas & Croissants: Medialuna ($3.400) [ID: dulce-medialuna], Croissant ($3.400) [ID: dulce-croissant], Croissant Pistacho ($7.000) [ID: dulce-croissant-pistacho], Croissant de Nutella ($7.000) [ID: dulce-croissant-nutella], Croissant Frutos Rojos ($7.000) [ID: dulce-croissant-frutos-rojos], Croissant Bonobon ($7.000) [ID: dulce-croissant-bonobon].
- Alfajores ($4.800): Alfajor Chocolate [ID: alfajor-choco-ddl-frutos-rojos], Alfajor Maní [ID: alfajor-mani], Alfajor Pistacho [ID: alfajor-pistacho].
- Minicakes & Lingotes: Lingotes de Chocotorta ($8.000) [ID: lingote-chocotorta], Minicake Lemon Pie ($8.000) [ID: minicake-lemon-pie].
- Budines ($4.200): Porción Budín Banana [ID: budin-banana], Porción Budín Limón [ID: budin-limon], Porción Budín Carrot Cake [ID: budin-carrot].
- Rolls & Más: Roll de Canela ($5.200) [ID: roll-canela], Roll de Chocolate ($4.600) [ID: roll-chocolate], Al Vuelo ($7.000) [ID: al-vuelo].

4. SALADOS & BRUNCH:
- Tostadas: Tostado de Jamón y Queso ($7.000) [ID: tostado-jamon-queso], Tostado de Jamón y Queso Especial ($9.000) [ID: tostado-jamon-queso-especial], Tostado de Jamón Crudo ($9.000) [ID: tostado-jamon-crudo], Jamón Crudo Toast ($7.000) [ID: jamon-crudo-toast], Tostadas con 2 Dips ($4.000) [ID: tostadas-2-dips], Tostadas con Huevo y Palta ($4.500) [ID: tostadas-huevo-palta].
- Croissants: Croissant Mafalda ($7.000) [ID: croissant-mafalda], Croissant de Jamón Crudo ($8.000) [ID: croissant-jamon-crudo], Croissant Avocado ($7.000) [ID: croissant-avocado].
- Avocados: Avocado Toast ($7.000) [ID: avocado-toast].
- Keto: Plato Keto ($7.000 - sin TACC) [ID: plato-keto].
- Americano Completo: Americano Completo ($9.000) [ID: americano-completo].

5. ESPECIAL DE LA CASA:
- Alito Formoseño con papas McCain (ideal para compartir) ($30.000) [ID: alito-formoseno-completo]
- 1/2 Alito Formoseño con papas McCain ($18.000) [ID: alito-formoseno-medio]

6. ALMUERZOS & COMIDAS:
- Sandwiches & Wraps:
  * Club Sandwich ($13.000) [ID: club-sandwich]
  * Wrap de Atún ($13.000) [ID: wrap-atun]
  * Wrap de Pollo ($12.000) [ID: wrap-pollo]
- Ensaladas: Ensalada César ($9.000) [ID: ensalada-cesar], Ensalada de Atún ($12.000) [ID: ensalada-atun].
- Platos & Minutas:
  * Pollo con Guarnición ($12.000) [ID: pollo-guarnicion]
  * Empanada por Unidad ($2.500) [ID: empanada-unidad]
  * Empanadas x Media Docena 6u ($13.000) [ID: empanada-media-docena]
  * Empanadas x Docena 12u ($24.000) [ID: empanada-docena]
  * Porción de Locro ($15.000) [ID: porcion-locro]
  * Menú para 1 ($33.500) [ID: menu-para-1]
  * Menú para 2 ($66.000) [ID: menu-para-2]

7. PAPAS Y PICADAS:
- Papas Fritas:
  * Papas Regulares ($10.000) [ID: papas-regulares]
  * Papas con cheddar y verdeo ($12.000) [ID: papas-cheddar-verdeo]
  * Papas con cheddar, verdeo y panceta ($15.000) [ID: papas-cheddar-panceta]
- Picadas:
  * Picada Fría para 2 Personas ($27.000) [ID: picada-2-personas]
  * Picada Fría para 4 Personas ($50.000) [ID: picada-4-personas]

8. PIZZAS (Masa de la casa a la piedra):
- Pizza Muzzarella ($15.000) [ID: pizza-muzzarella]
- Pizza Napolitana ($15.000) [ID: pizza-napolitana]
- Pizza Especial ($18.000) [ID: pizza-especial]
- Pizza 4 Quesos ($18.000) [ID: pizza-4-quesos]
- Pizza Rúcula y Crudo ($18.000) [ID: pizza-rucula-crudo]
- Pizza Pepperoni ($18.000) [ID: pizza-pepperoni]

9. CERVEZAS TIRADAS, TRAGOS & VINOS:
- Cervezas Tiradas Pintas 473ml ($5.000):
  * Pinta Pilsen Ogham [ID: pinta-pilsen-ogham]
  * Pinta IPA Ogham [ID: pinta-ipa-ogham]
  * Pinta Red Lather IPA [ID: pinta-red-lather]
  * Pinta Honey Lather [ID: pinta-honey-lather]
  * Pinta Amber Lager [ID: pinta-amber-lager]
  * Pinta Barley Ogham [ID: pinta-barley-ogham]
  * Pinta Stout Ron y Nieve [ID: pinta-stout-ron-nieve]
  * Pinta Neipa Mur [ID: pinta-neipa-mur]
- Tragos ($6.000 / $5.000):
  * Vaso Fernet con Coca ($6.000) [ID: vaso-fernet]
  * Vaso Gin Tónica ($6.000) [ID: vaso-gin-tonica]
  * Vaso Gin Pomelo ($6.000) [ID: vaso-gin-pomelo]
  * Vaso Aperol Spritz ($6.000) [ID: vaso-aperol]
  * Vaso Campari ($6.000) [ID: vaso-campari]
  * Vaso Vermut Tónica ($6.000) [ID: vaso-vermut-tonica]
  * Vaso Vermut Pomelo ($6.000) [ID: vaso-vermut-pomelo]
  * Amargo Obrero Tónica ($6.000) [ID: trago-amargo-obrero-tonica]
  * Amargo Obrero Pomelo ($6.000) [ID: trago-amargo-obrero-pomelo]
  * Vaso Vodka ($5.000) [ID: vaso-vodka]
  * Fernet 750ml Botella ($25.000) [ID: botella-fernet-750]
  * Champagne ($34.000) [ID: botella-champagne]
- Vinos:
  * Copa de Vino ($4.000) [ID: vino-copa]
  * Norton Cosecha Tardía Blanco ($7.000) [ID: vino-norton-cosecha-tardio]
  * El Cazador Malbec ($8.000) [ID: vino-el-cazador-malbec]
  * Anaia Malbec ($12.000) [ID: vino-anaia-malbec]
  * La Linda Malbec ($16.000) [ID: vino-la-linda-malbec]
  * Trumpeter Reserva Malbec ($18.000) [ID: vino-trumpeter-reserva-malbec]
  * Luigi Bosca Malbec ($25.000) [ID: vino-luigi-bosca-malbec]

10. BEBIDAS SIN ALCOHOL:
- Jugos Naturales:
  * Jugo de Naranja Vaso ($4.500) [ID: jugo-naranja-vaso]
  * Jugo de Naranja 500ml ($4.000) [ID: jugo-naranja-500]
  * Jugo de Naranja 1L Jarra ($7.500) [ID: jugo-naranja-jarra]
  * Jugo Limón, Jengibre y Menta 500ml ($4.000) [ID: jugo-limon-jengibre-500]
  * Jugo Limón, Jengibre y Menta 1L Jarra ($7.500) [ID: jugo-limon-jengibre-jarra]
- Gaseosas - Línea Personal (350ml):
  * Coca Cola 350ml ($3.000) [ID: gas-coca-350]
  * Coca Cola Zero 350ml ($3.000) [ID: gas-coca-zero-350]
  * Sprite 350ml ($3.000) [ID: gas-sprite-350]
  * Fanta 350ml ($3.000) [ID: gas-fanta-350]
  * Paso de los Toros Pomelo ($2.000) [ID: gas-paso-toros-pomelo]
  * Paso de los Toros Tónica ($2.000) [ID: gas-paso-toros-tonica]
- Gaseosas - Línea Compartir (1,25 Litros):
  * Coca Cola 1,25L ($5.500) [ID: gas-coca-125]
  * Coca Cola Zero 1,25L ($5.500) [ID: gas-coca-zero-125]
  * Sprite 1,25L ($5.500) [ID: gas-sprite-125]
  * Fanta Naranja 1,25L ($5.500) [ID: gas-fanta-125]
- Aguas y Saborizadas:
  * Agua 500ml ($2.000) [ID: agua-500]
  * Aquarius (Manzana, Naranja, Pera, Pomelo, Uva Verde) 500ml ($3.000) [ID: aquarius-pomelo]
- Energizantes & Cerveza 0%:
  * Speed XL ($4.000) [ID: speed-xl]
  * Red Bull 250cm ($4.000) [ID: red-bull-250]
  * Corona Cero 330ml ($4.000) [ID: corona-cero-330]

11. BEBIDAS CON ALCOHOL (Botellas y Latas):
- Cervezas:
  * Andes IPA Litro ($7.000) [ID: andes-ipa-litro]
  * Andes Roja Litro ($7.000) [ID: andes-roja-litro]
  * Andes Rubia Litro ($7.000) [ID: andes-rubia-litro]
  * Corona 330ml ($5.500) [ID: corona-330]
  * Corona 710ml ($9.000) [ID: corona-710]
  * Stella Artois Lata 473ml ($5.200) [ID: stella-artois-lata-473]
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
