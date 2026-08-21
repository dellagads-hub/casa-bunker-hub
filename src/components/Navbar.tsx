import React from 'react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Bot, ArrowLeft, UtensilsCrossed, Bike } from 'lucide-react';

interface NavbarProps {
  currentRoute: 'hub' | 'carta' | 'delivery';
  onNavigate: (route: 'hub' | 'carta' | 'delivery') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { totalCount, totalPrice, setIsCartOpen, setIsMozoOpen, orderDetails } = useCart();

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#EFE6D8]/95 backdrop-blur-md border-b border-[#DFD5C6] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Left: Back button or Brand */}
        <div className="flex items-center gap-2.5">
          {currentRoute !== 'hub' ? (
            <button
              id="nav-back-button"
              onClick={() => onNavigate('hub')}
              className="p-2 rounded-xl bg-white hover:bg-[#F2E8DB] border border-[#DFD5C6] text-[#284233] transition-all flex items-center gap-1 text-xs font-semibold shadow-xs"
              title="Volver al Inicio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Links</span>
            </button>
          ) : null}

          <button
            id="nav-brand-button"
            onClick={() => onNavigate('hub')}
            className="flex items-center gap-2.5 text-left group"
          >
            <Logo size="sm" withGlow={false} />
            <div>
              <span className="font-serif-brand text-base sm:text-lg font-bold tracking-tight text-[#284233] group-hover:text-[#BA7738] transition-colors block leading-tight">
                Casa Bunker
              </span>
              <p className="text-[10px] text-[#6A6052] tracking-wider flex items-center gap-1">
                <span>BAR & CAFÉ</span>
                <span className="text-[#BA7738]">•</span>
                <span className="text-emerald-700 font-bold">Abierto</span>
              </p>
            </div>
          </button>
        </div>

        {/* Center / Navigation Pills (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/70 p-1 rounded-xl border border-[#DFD5C6]">
          <button
            onClick={() => onNavigate('hub')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentRoute === 'hub'
                ? 'bg-[#284233] text-white shadow-xs'
                : 'text-[#5C5447] hover:text-[#284233]'
            }`}
          >
            Links
          </button>
          <button
            onClick={() => onNavigate('carta')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentRoute === 'carta'
                ? 'bg-[#284233] text-white shadow-xs'
                : 'text-[#5C5447] hover:text-[#284233]'
            }`}
          >
            Carta Digital
          </button>
          <button
            onClick={() => onNavigate('delivery')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentRoute === 'delivery'
                ? 'bg-[#284233] text-white shadow-xs'
                : 'text-[#5C5447] hover:text-[#284233]'
            }`}
          >
            Delivery
          </button>
        </nav>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Table Indicator Badge */}
          {orderDetails.tableNumber && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#284233]/10 border border-[#284233]/20 text-[#284233] text-xs font-semibold">
              <span>Mesa #{orderDetails.tableNumber}</span>
            </div>
          )}

          {/* Mozo IA Button */}
          <button
            id="nav-mozo-button"
            onClick={() => setIsMozoOpen(true)}
            className="relative px-3 py-1.5 rounded-xl bg-white hover:bg-[#F7F0E6] border border-[#DFD5C6] text-[#284233] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs group"
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-[#BA7738] group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <span className="hidden sm:inline">Búnker Bot</span>
            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#284233] text-white rounded-md">
              MOZO IA
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            id="nav-cart-button"
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
              totalCount > 0
                ? 'bg-[#BA7738] text-white border-[#A6662B] font-bold hover:bg-[#A6662B]'
                : 'bg-white text-[#284233] border-[#DFD5C6] hover:bg-[#F7F0E6]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCount > 0 ? (
              <>
                <span className="text-xs font-bold">{totalCount}</span>
                <span className="hidden sm:inline text-xs font-extrabold border-l border-white/30 pl-1.5">
                  {formatPrice(totalPrice)}
                </span>
              </>
            ) : (
              <span className="hidden sm:inline text-xs font-semibold">Pedido</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

