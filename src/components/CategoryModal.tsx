import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryInfo, MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { getItemImage } from '../utils/itemImages';
import { ChevronLeft, X, Plus, Minus, Check, Sparkles, MessageSquare } from 'lucide-react';

interface CategoryModalProps {
  category: CategoryInfo;
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  items,
  isOpen,
  onClose,
}) => {
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [itemNote, setItemNote] = useState('');

  if (!isOpen) return null;

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  // Group items by subcategory according to category.subcategorias or item.subcategoria
  const subcategories = category.subcategorias && category.subcategorias.length > 0
    ? category.subcategorias
    : Array.from(new Set(items.map((i) => i.subcategoria || category.nombre)));

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item, 1);
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId((curr) => (curr === item.id ? null : curr));
    }, 1200);
  };

  const handleCustomAdd = () => {
    if (!customizingItem) return;
    addItem(customizingItem, 1, itemNote);
    setJustAddedId(customizingItem.id);
    setCustomizingItem(null);
    setItemNote('');
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#f6f1e3] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col border border-stone-200/70"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner with Category Image */}
          <div className="relative h-44 sm:h-52 w-full shrink-0 overflow-hidden bg-stone-900">
            <img
              src={category.imageUrl}
              alt={category.nombre}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

            {/* Category Title & Subtitle in Cover */}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md text-white">
                {category.nombre}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 font-medium mt-1 drop-shadow-xs">
                {category.subtitulo}
              </p>
            </div>
          </div>

          {/* Navigation Bar inside Modal */}
          <div className="px-4 py-3 bg-[#f6f1e3] border-b border-stone-200/60 flex items-center justify-between sticky top-0 z-20">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-stone-800 hover:bg-stone-50 border border-stone-200 text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Subcategories and Products List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {subcategories.map((subName) => {
              const subItems = items.filter(
                (item) =>
                  (item.subcategoria &&
                    item.subcategoria.toLowerCase() === subName.toLowerCase()) ||
                  (!item.subcategoria && subName === category.nombre)
              );

              if (subItems.length === 0) return null;

              return (
                <div key={subName} className="space-y-3">
                  {/* Subcategory Section Header */}
                  <h3 className="text-xs sm:text-sm font-black tracking-wider text-[#1e3b2b] uppercase px-1">
                    {subName}
                  </h3>

                  {/* List of Products */}
                  <div className="space-y-3">
                    {subItems.map((item) => {
                      const imageSrc = item.imageUrl || getItemImage(item.id, category.nombre);
                      const cartEntries = cartItems.filter((i) => i.menuItemId === item.id);
                      const qtyInCart = cartEntries.reduce((acc, i) => acc + i.cantidad, 0);
                      const isAdded = justAddedId === item.id;

                      return (
                        <div
                          key={item.id}
                          id={`product-card-${item.id}`}
                          className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-stone-200/70 hover:border-amber-600/30 transition-all flex gap-3 sm:gap-4 items-center justify-between"
                        >
                          {/* Left: Thumbnail Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 border border-stone-100 bg-stone-100 shadow-2xs">
                            <img
                              src={imageSrc}
                              alt={item.nombre}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Center: Details */}
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                              {item.nombre}
                            </h4>
                            {item.descripcion && (
                              <p className="text-xs text-stone-600 font-normal leading-relaxed mt-1 line-clamp-3">
                                {item.descripcion}
                              </p>
                            )}
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="font-bold text-[#b86326] text-sm sm:text-base">
                                {formatPrice(item.precio)}
                              </span>
                              {item.destacado && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                                  <Sparkles className="w-2.5 h-2.5" /> Popular
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Action Button */}
                          <div className="shrink-0 flex flex-col items-end gap-1.5">
                            {qtyInCart > 0 ? (
                              <div className="flex items-center gap-1 bg-[#1e3b2b]/10 rounded-full p-1 border border-[#1e3b2b]/20">
                                <button
                                  onClick={() => {
                                    const entry = cartEntries[0];
                                    if (entry) updateQuantity(entry.id, entry.cantidad - 1);
                                  }}
                                  className="w-6 h-6 rounded-full bg-white text-[#1e3b2b] flex items-center justify-center font-bold text-xs shadow-xs hover:bg-stone-50 active:scale-95"
                                  aria-label="Restar"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold text-[#1e3b2b] px-1.5">
                                  {qtyInCart}
                                </span>
                                <button
                                  onClick={() => handleQuickAdd(item)}
                                  className="w-6 h-6 rounded-full bg-[#1e3b2b] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#152a1e] active:scale-95"
                                  aria-label="Sumar"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleQuickAdd(item)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#1e3b2b] hover:bg-[#14281d] text-white'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" /> Agregado
                                  </>
                                ) : (
                                  '+ Agregar'
                                )}
                              </button>
                            )}

                            {/* Optional button to add special note */}
                            <button
                              onClick={() => setCustomizingItem(item)}
                              className="text-[10px] text-stone-500 hover:text-stone-800 font-medium flex items-center gap-0.5 underline decoration-stone-300 hover:decoration-stone-600 transition-colors"
                            >
                              <MessageSquare className="w-2.5 h-2.5" /> Aclaración
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Note Dialog if opened */}
          {customizingItem && (
            <div className="p-4 bg-white border-t border-stone-200 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-800">
                  Aclaración para {customizingItem.nombre}
                </span>
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Ej: Sin cebolla, leche vegetal, bien caliente..."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1e3b2b] mb-2.5 bg-stone-50"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCustomAdd}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1e3b2b] hover:bg-[#14281d]"
                >
                  Guardar y Agregar
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
