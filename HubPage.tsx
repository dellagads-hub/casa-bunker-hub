import React from 'react';
import { Logo } from '../components/Logo';
import {
  Bike,
  Smartphone,
  Instagram,
  MessageCircle,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useCart, WHATSAPP_PHONE } from '../context/CartContext';

interface HubPageProps {
  onNavigate: (route: 'hub' | 'carta' | 'delivery') => void;
}

export const HubPage: React.FC<HubPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#EFE6D8] text-[#284233] px-4 py-8 max-w-md mx-auto flex flex-col items-center justify-between">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center w-full mt-2 mb-6">
        {/* Optimized Logo Container */}
        <div className="mb-4 transform transition-transform duration-300 hover:scale-105">
          <Logo size="lg" withGlow={true} />
        </div>

        {/* Brand Title - Strict No-Wrap to prevent 'R' jumping */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#284233] tracking-wider uppercase font-serif-brand whitespace-nowrap">
          CASA BÚNKER
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#5a685e] font-semibold mt-1.5 leading-snug">
          Bar & Cafetería | Del café de especialidad a la previa
        </p>
      </div>

      {/* Main Buttons / Links List */}
      <div className="w-full space-y-3.5 mb-6">
        {/* 1. Hacé tu pedido (Delivery / Takeaway) */}
        <button
          id="hub-link-delivery"
          onClick={() => onNavigate('delivery')}
          className="w-full p-4 rounded-2xl bg-[#BA7738] hover:bg-[#A5662E] active:scale-[0.98] text-white text-left transition-all duration-200 shadow-md flex items-center gap-3.5 cursor-pointer border border-[#A5662E]/30 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-sm sm:text-base text-white block">
              Hacé tu pedido
            </span>
            <span className="text-xs text-white/90 block mt-0.5 font-medium">
              Delivery / Takeaway
            </span>
          </div>
        </button>

        {/* 2. Carta Digital & Mozo IA (Estás en el Bar) */}
        <button
          id="hub-link-carta"
          onClick={() => onNavigate('carta')}
          className="w-full p-4 rounded-2xl bg-[#BA7738] hover:bg-[#A5662E] active:scale-[0.98] text-white text-left transition-all duration-200 shadow-md flex items-center gap-3.5 cursor-pointer border border-[#A5662E]/30 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-sm sm:text-base text-white block">
              Carta Digital & Mozo IA
            </span>
            <span className="text-xs text-white/90 block mt-0.5 font-medium">
              Estás en el Bar
            </span>
          </div>
        </button>

        {/* 3. Seguinos en Instagram (@casabunker.cba) */}
        <a
          id="hub-link-instagram"
          href="https://instagram.com/casabunker.cba"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-2xl bg-[#BA7738] hover:bg-[#A5662E] active:scale-[0.98] text-white text-left transition-all duration-200 shadow-md flex items-center gap-3.5 cursor-pointer border border-[#A5662E]/30 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Instagram className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-sm sm:text-base text-white block">
              Seguinos en Instagram
            </span>
            <span className="text-xs text-white/90 block mt-0.5 font-medium">
              @casabunker.cba
            </span>
          </div>
        </a>

        {/* 4. Contacto directo (WhatsApp) */}
        <a
          id="hub-link-whatsapp"
          href={`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent('¡Hola Casa Búnker! Me gustaría consultar por reservas o información.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 rounded-2xl bg-[#BA7738] hover:bg-[#A5662E] active:scale-[0.98] text-white text-left transition-all duration-200 shadow-md flex items-center gap-3.5 cursor-pointer border border-[#A5662E]/30 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-sm sm:text-base text-white block">
              Contacto directo
            </span>
            <span className="text-xs text-white/90 block mt-0.5 font-medium">
              WhatsApp
            </span>
          </div>
        </a>

        {/* 5. Card de Horarios */}
        <div className="w-full p-4 rounded-2xl bg-[#F6EFE6] border border-stone-300/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#284233] uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-[#BA7738]" />
            <span>Horarios</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-stone-700">
              <span className="font-medium">Domingo a Miércoles</span>
              <span className="font-bold text-stone-900">08:00 – 02:00</span>
            </div>
            <div className="flex justify-between items-center text-stone-700">
              <span className="font-medium">Jueves a Sábado y feriados</span>
              <span className="font-bold text-stone-900">08:00 – 04:00</span>
            </div>
          </div>
        </div>

        {/* 6. Card de Ubicación con Mapa */}
        <div className="w-full rounded-2xl bg-[#F6EFE6] border border-stone-300/80 shadow-xs overflow-hidden">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#284233] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#BA7738]" />
              <span>Ubicación</span>
            </div>
            <a
              href="https://maps.google.com/?q=Poeta+Lugones+412,+Nueva+Cordoba,+Cordoba"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Abrir en Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="w-full h-36 bg-stone-200 relative border-y border-stone-200">
            <iframe
              title="Ubicación Casa Búnker"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.707767352378!2d-64.1868516!3d-31.4221161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28fc6285497%3A0xc3ce17f698e6c710!2sPoeta%20Lugones%20412%2C%20X5000%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Bottom Button "Cómo llegar" */}
          <a
            href="https://maps.google.com/?q=Poeta+Lugones+412,+Nueva+Cordoba,+Cordoba"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#284233] hover:bg-[#1E3327] text-white text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Cómo llegar</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-stone-600 pb-2">
        <p>© Casa Búnker - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};
