import React from 'react';
import { Logo } from '../components/Logo';
import {
  Utensils,
  ShoppingBag,
  MessageCircle,
  Instagram,
  MapPin,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useCart, WHATSAPP_PHONE } from '../context/CartContext';

interface HubPageProps {
  onNavigate: (route: 'hub' | 'carta' | 'delivery') => void;
}

export const HubPage: React.FC<HubPageProps> = ({ onNavigate }) => {
  const { setIsMozoOpen } = useCart();

  return (
    <div className="min-h-screen bg-[#f3edd9] flex flex-col items-center justify-between px-4 py-8 max-w-md mx-auto">
      {/* Top Brand Header */}
      <div className="flex flex-col items-center text-center w-full mt-2 mb-6">
        {/* Logo Badge */}
        <div className="mb-4 hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#fdfbf7] p-1 shadow-md border border-stone-300/60 flex items-center justify-center">
            <Logo size="lg" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#1c3327] tracking-[0.25em] uppercase font-serif-brand">
          C A S A &nbsp; B Ú N K E R
        </h1>

        {/* Brand Slogan */}
        <p className="text-xs sm:text-sm text-[#5a685e] font-semibold mt-1">
          Refugio Exclusivo • Café & Bar
        </p>

        {/* Open Status Badge */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ebe3cd] text-[#4d594f] text-xs font-semibold border border-stone-300/70 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Abierto hoy hasta las 02:00 hs</span>
        </div>
      </div>

      {/* Main Action Links */}
      <div className="w-full space-y-3.5 mb-6">
        {/* 1. Hero Dark Green Card: Carta Digital & Pedidos */}
        <button
          id="hub-link-carta"
          onClick={() => onNavigate('carta')}
          className="w-full p-4 sm:p-5 rounded-3xl bg-[#1c3327] hover:bg-[#14261d] text-white text-left transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-4 cursor-pointer relative overflow-hidden group border border-emerald-900/40"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-white">
                Carta Digital & Pedidos
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#b86326] text-white text-[10px] font-black uppercase tracking-wider">
                CON MOZO IA
              </span>
            </div>
            <p className="text-xs text-white/80 mt-1 font-normal line-clamp-1">
              Explora el menú o pide recomendaciones en mesa.
            </p>
          </div>
          <div className="text-amber-300/80 group-hover:text-amber-300 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
        </button>

        {/* 2. White Card: Delivery & Take Away */}
        <button
          id="hub-link-delivery"
          onClick={() => onNavigate('delivery')}
          className="w-full p-4 rounded-3xl bg-[#fdfbf7] hover:bg-white text-left transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] flex items-center gap-3.5 cursor-pointer border border-stone-200/80 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#eee5d3] flex items-center justify-center text-[#1c3327] shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm sm:text-base text-[#1c3327] block">
              Delivery & Take Away
            </span>
            <span className="text-xs text-[#6e7771] block mt-0.5 font-medium">
              Envíos directos y retiro en local.
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </button>

        {/* 3. White Card: Contacto & Reservas */}
        <a
          id="hub-link-whatsapp"
          href={`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent('¡Hola Casa Búnker! Me gustaría consultar por reservas o información.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-3xl bg-[#fdfbf7] hover:bg-white text-left transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] flex items-center gap-3.5 cursor-pointer border border-stone-200/80 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#eee5d3] flex items-center justify-center text-[#1c3327] shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm sm:text-base text-[#1c3327] block">
              Contacto & Reservas
            </span>
            <span className="text-xs text-[#6e7771] block mt-0.5 font-medium">
              Atención personalizada vía WhatsApp.
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </a>

        {/* 4. White Card: Comunidad Instagram */}
        <a
          id="hub-link-instagram"
          href="https://instagram.com/casabunker.cba"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-3xl bg-[#fdfbf7] hover:bg-white text-left transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] flex items-center gap-3.5 cursor-pointer border border-stone-200/80 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#eee5d3] flex items-center justify-center text-[#1c3327] shrink-0 group-hover:scale-105 transition-transform">
            <Instagram className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm sm:text-base text-[#1c3327] block">
              Comunidad Instagram
            </span>
            <span className="text-xs text-[#6e7771] block mt-0.5 font-medium">
              @casabunker.cba
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </a>

        {/* 5. White Card: Cómo llegar */}
        <a
          id="hub-link-mapa"
          href="https://maps.google.com/?q=Poeta+Lugones+412,+Nueva+Cordoba,+Cordoba"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-3xl bg-[#fdfbf7] hover:bg-white text-left transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] flex items-center gap-3.5 cursor-pointer border border-stone-200/80 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#eee5d3] flex items-center justify-center text-[#1c3327] shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm sm:text-base text-[#1c3327] block">
              Cómo llegar
            </span>
            <span className="text-xs text-[#6e7771] block mt-0.5 font-medium">
              Poeta Lugones 412, Nva Cba.
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-700 transition-colors" />
        </a>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-stone-500 pb-2">
        <p>© {new Date().getFullYear()} Casa Búnker • Todos los derechos reservados</p>
      </div>
    </div>
  );
};
