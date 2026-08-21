import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { MENU_ITEMS } from '../data/menuData';
import { MenuItem, MozoMessage } from '../types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Plus,
  Check,
  Coffee,
  Beer,
  MessageCircle,
  Copy,
  ExternalLink,
  ShoppingBag,
  Flame,
  ArrowRight
} from 'lucide-react';

const QUICK_PROMPTS = [
  '¿Qué maridaje me recomendás para una Cerveza?',
  '¿Qué dulce me recomendás con un Café?',
  'Quiero pedir Alito Formoseño y Pintas',
  '¿Qué incluye el Americano Completo?',
  'Opción saludable: Plato Keto o Ensalada',
  'Confirmar pedido: Nombre: Juan, Mesa: 4, Pago: Efectivo',
];

export const MozoIADrawer: React.FC = () => {
  const { isMozoOpen, setIsMozoOpen, addItem } = useCart();
  const [messages, setMessages] = useState<MozoMessage[]>([
    {
      id: 'welcome',
      sender: 'mozo',
      text: '¡Buenas! 👋 Soy **Búnker Bot**, el mozo virtual y asistente gastronómico exclusivo de Casa Búnker.\n\nEstoy acá para atenderte, sugerirte maridajes ideales (con café algo dulce 🥐, con cerveza papas o picadas 🧀🍺) y armar tu pedido listo para WhatsApp.\n\n¿Qué se te antoja hoy?',
      timestamp: 'Ahora',
      suggestedItems: [
        MENU_ITEMS.find((i) => i.id === 'alito-formoseno-completo'),
        MENU_ITEMS.find((i) => i.id === 'papas-cheddar-verdeo'),
        MENU_ITEMS.find((i) => i.id === 'pinta-ipa-473'),
        MENU_ITEMS.find((i) => i.id === 'cafe-flat-white'),
      ].filter((i): i is MenuItem => Boolean(i)),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMozoOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMozoOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: MozoMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mozo-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-5).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      let matchedItems: MenuItem[] = [];
      if (data.suggestedItemIds && Array.isArray(data.suggestedItemIds)) {
        matchedItems = data.suggestedItemIds
          .map((id: string) => MENU_ITEMS.find((item) => item.id === id || item.id.includes(id)))
          .filter((item: any): item is MenuItem => Boolean(item));
      }

      // If no matched items found via IDs, attempt fallback keyword match
      if (matchedItems.length === 0) {
        const lower = (data.reply || '').toLowerCase();
        matchedItems = MENU_ITEMS.filter((item) => lower.includes(item.nombre.toLowerCase())).slice(0, 4);
      }

      // Extract whatsapp link from reply or response payload
      const waFromPayload = data.whatsappUrl;
      const waFromText = (data.reply || '').match(/https:\/\/wa\.me\/5493510000000\?text=[^\s\n\)]+/i);
      const finalWaUrl = waFromPayload || (waFromText ? waFromText[0] : undefined);

      const mozoMsg: MozoMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mozo',
        text: data.reply || '¡Listo! Te recomiendo probar esas opciones de nuestra carta.',
        timestamp: 'Ahora',
        suggestedItems: matchedItems.slice(0, 4),
        whatsappUrl: finalWaUrl,
      };

      setMessages((prev) => [...prev, mozoMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: MozoMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mozo',
        text: '¡Che! Soy **Búnker Bot**. Justo hay mucho movimiento en la barra, pero te súper recomiendo probar el **Alito Formoseño ($30.000)**, las **Papas con Cheddar y Verdeo ($10.000)** o una **Pinta IPA 473ml ($5.000)**. ¿Querés que te prepare el pedido?',
        timestamp: 'Ahora',
        suggestedItems: [
          MENU_ITEMS.find((i) => i.id === 'alito-formoseno-completo'),
          MENU_ITEMS.find((i) => i.id === 'papas-cheddar-verdeo'),
          MENU_ITEMS.find((i) => i.id === 'pinta-ipa-473'),
        ].filter((i): i is MenuItem => Boolean(i)),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggested = (item: MenuItem) => {
    addItem(item, 1);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const handleCopyWhatsAppLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  if (!isMozoOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={() => setIsMozoOpen(false)} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg h-full bg-[#EFE6D8] border-l border-[#DFD5C6] flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#DFD5C6] bg-white flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-[#284233] text-white shadow-xs">
              <Bot className="w-5 h-5 text-[#EFE6D8]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-brand font-bold text-base text-[#284233]">
                  Búnker Bot • Mozo Virtual
                </h2>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-[#BA7738] text-white rounded">
                  Casa Búnker
                </span>
              </div>
              <p className="text-xs text-[#635B4F] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Maridajes, atención en mesa y pedidos a WhatsApp
              </p>
            </div>
          </div>

          <button
            id="btn-close-mozo"
            onClick={() => setIsMozoOpen(false)}
            className="p-2 rounded-xl bg-[#F6EFE5] hover:bg-[#EFE6D8] border border-[#DFD5C6] text-[#4A4338] hover:text-[#284233] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2.5 bg-[#F6EFE5] border-b border-[#DFD5C6] overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#BA7738] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Sugerencias:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white hover:bg-[#284233] border border-[#DFD5C6] hover:border-[#284233] text-[#4A4338] hover:text-white whitespace-nowrap transition-all text-left shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#284233] text-white rounded-br-none'
                      : 'bg-white text-[#284233] rounded-bl-none border border-[#DFD5C6]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* WhatsApp Order Action Card if link is generated */}
                {!isUser && msg.whatsappUrl && (
                  <div className="mt-3 w-full max-w-[95%] p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Pedido Listo para WhatsApp</span>
                    </div>

                    <p className="text-[11px] text-[#4A4338]">
                      Hacé clic abajo para abrir WhatsApp con tu pedido ya redactado y enviarlo directo a Casa Búnker:
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={msg.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Abrir en WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>

                      <button
                        onClick={() => handleCopyWhatsAppLink(msg.whatsappUrl!)}
                        className="px-3 py-2.5 rounded-xl bg-[#F6EFE5] hover:bg-[#EFE6D8] border border-[#DFD5C6] text-[#284233] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Copiar enlace"
                      >
                        {copiedLink === msg.whatsappUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#BA7738]" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested Action Cards inside Mozo reply */}
                {!isUser && msg.suggestedItems && msg.suggestedItems.length > 0 && (
                  <div className="mt-2.5 w-full max-w-[95%] space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-[#BA7738] uppercase block">
                      Sugerencias de la Carta:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedItems.map((item) => {
                        const isAdded = addedItemIds[item.id];
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-white border border-[#DFD5C6] hover:border-[#BA7738] flex items-center justify-between gap-3 transition-colors shadow-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-xs text-[#284233] block truncate">
                                {item.nombre}
                              </span>
                              <span className="text-xs font-semibold text-[#BA7738]">
                                {formatPrice(item.precio)}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddSuggested(item)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                isAdded
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-[#BA7738] hover:bg-[#A8682D] text-white shadow-xs'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Sumado</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Agregar</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="p-3 rounded-2xl bg-white border border-[#DFD5C6] rounded-bl-none flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#BA7738] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#BA7738] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#BA7738] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-[#635B4F] ml-1">Búnker Bot está pensando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-[#DFD5C6] bg-white flex items-center gap-2 shadow-sm"
        >
          <input
            id="mozo-chat-input"
            type="text"
            placeholder="Preguntale a Búnker Bot (ej: ¿Qué comer con una cerveza?)..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none transition-colors"
          />

          <button
            id="btn-mozo-send"
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#BA7738] hover:bg-[#A8682D] disabled:opacity-40 disabled:hover:bg-[#BA7738] text-white font-bold transition-all shadow-xs flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


