import React, { useState, useMemo } from 'react';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { CategoryInfo } from '../types';
import { CategoryModal } from '../components/CategoryModal';
import { useCart } from '../context/CartContext';
import { Logo } from '../components/Logo';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Sparkles,
  ShoppingBag,
  Bot,
  Filter,
} from 'lucide-react';

interface MenuPageProps {
  onNavigate: (route: 'hub' | 'carta' | 'delivery') => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const { totalCount, totalPrice, setIsCartOpen, setIsMozoOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  // Filter items if searching globally
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MENU_ITEMS.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(q) ||
        item.descripcion?.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q) ||
        item.subcategoria?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f3edd9] text-stone-900 pb-28">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#fbf8f0]/95 backdrop-blur-md border-b border-stone-200/70 shadow-2xs px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Back to Hub button */}
          <button
            id="btn-volver-hub"
            onClick={() => onNavigate('hub')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c3327] hover:bg-[#13251c] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al Hub</span>
          </button>

          {/* Title Header */}
          <span className="font-bold text-xs sm:text-sm text-[#1c3327] tracking-tight">
            Carta Digital & Mozo IA
          </span>

          {/* Logo Badge */}
          <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 shadow-2xs flex items-center justify-center bg-[#fdfbf7]">
            <Logo size="sm" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-6">
        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162c20] tracking-tight font-serif-brand">
            Carta Digital
          </h1>
          <p className="text-xs sm:text-sm text-[#5a685e] font-medium mt-1">
            Consumo en mesa. Tocá una categoría para ver los productos.
          </p>

          {/* Quick Search Toggle */}
          <div className="mt-3 flex justify-center">
            {isSearchOpen ? (
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en toda la carta (ej: IPA, tostado, alito...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 rounded-full text-xs bg-white border border-stone-300 focus:outline-none focus:border-[#1c3327] shadow-xs text-stone-800"
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 border border-stone-200/80 text-xs font-semibold shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar producto</span>
              </button>
            )}
          </div>
        </div>

        {/* If Searching, show search results */}
        {searchQuery.trim().length > 0 ? (
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Resultados para "{searchQuery}" ({searchResults.length})
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-800 font-bold hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-stone-200 p-6">
                <p className="text-sm font-semibold text-stone-700">No encontramos productos con ese nombre</p>
                <p className="text-xs text-stone-500 mt-1">Probá con otra palabra o tocá una categoría.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((item) => {
                  const cat = CATEGORIES.find(
                    (c) => c.nombre.toLowerCase() === item.categoria.toLowerCase()
                  );
                  return (
                    <div
                      key={item.id}
                      onClick={() => cat && setSelectedCategory(cat)}
                      className="bg-white rounded-2xl p-3.5 shadow-xs border border-stone-200 hover:border-amber-600/40 cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#1c3327] block">
                          {item.categoria} {item.subcategoria ? `• ${item.subcategoria}` : ''}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{item.nombre}</h4>
                        {item.descripcion && (
                          <p className="text-xs text-stone-600 line-clamp-2 mt-0.5">{item.descripcion}</p>
                        )}
                        <span className="font-bold text-[#b86326] text-sm mt-1 block">
                          {formatPrice(item.precio)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (cat) setSelectedCategory(cat);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#1c3327] text-white text-xs font-bold shrink-0 hover:bg-[#13251c]"
                      >
                        Ver en categoría
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Vertical Scrollable Category Cards */
          <div className="space-y-3.5">
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                id={`cat-card-${category.id}`}
                onClick={() => setSelectedCategory(category)}
                className="group relative h-28 sm:h-32 w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer border border-stone-300/40 bg-stone-900"
              >
                {/* Background Image */}
                <img
                  src={category.imageUrl}
                  alt={category.nombre}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

                {/* Category Card Content */}
                <div className="absolute inset-0 p-4 sm:p-5 flex items-center justify-between">
                  <div className="max-w-[75%]">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md group-hover:translate-x-1 transition-transform">
                      {category.nombre}
                    </h2>
                    <p className="text-xs text-white/80 font-medium mt-0.5 line-clamp-1 drop-shadow-xs">
                      {category.subtitulo}
                    </p>
                  </div>

                  {/* Right Circle Arrow Button */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#c2702a] group-hover:bg-[#a85e20] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-all">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Category Modal Dialog (Pop-up with subcategories and products) */}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          items={MENU_ITEMS.filter(
            (item) => item.categoria.toLowerCase() === selectedCategory.nombre.toLowerCase()
          )}
          isOpen={Boolean(selectedCategory)}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {/* Floating Mozo IA Button (Bottom Right) */}
      <button
        id="btn-floating-mozo-ia"
        onClick={() => setIsMozoOpen(true)}
        className="fixed bottom-6 right-5 z-40 bg-[#a6632f] hover:bg-[#8f5224] active:scale-95 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs sm:text-sm transition-all cursor-pointer border border-amber-900/20"
      >
        <Sparkles className="w-4 h-4 text-amber-200" />
        <span>Mozo IA</span>
      </button>

      {/* Floating Cart Indicator if items exist */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 left-4 right-28 sm:right-36 z-40 max-w-sm">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#1c3327] hover:bg-[#13251c] text-white py-3 px-4 rounded-2xl shadow-2xl flex items-center justify-between active:scale-98 transition-all border border-emerald-900/30 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-900 font-black text-xs flex items-center justify-center shadow-xs">
                {totalCount}
              </div>
              <span className="font-bold text-xs sm:text-sm">Ver Pedido</span>
            </div>
            <span className="font-bold text-xs sm:text-sm text-emerald-300">
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
