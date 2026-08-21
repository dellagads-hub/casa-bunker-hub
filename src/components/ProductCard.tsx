import React, { useState } from 'react';
import { MenuItem, CartAddition } from '../types';
import { useCart } from '../context/CartContext';
import { AVAILABLE_ADDITIONS } from '../data/menuData';
import { Plus, Minus, Check, MessageSquare, Sparkles, Coffee, Beer, Pizza, Utensils, Sandwich, Beef, Cookie, Wine, CupSoda, Flame, PlusCircle } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity } = useCart();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [itemNote, setItemNote] = useState('');
  const [selectedAdds, setSelectedAdds] = useState<CartAddition[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  // Find occurrences of this menu item in cart
  const cartEntries = items.filter((i) => i.menuItemId === item.id);
  const currentQuantity = cartEntries.reduce((acc, i) => acc + i.cantidad, 0);

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  const handleQuickAdd = () => {
    addItem(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleCustomAdd = () => {
    addItem(item, 1, itemNote, selectedAdds);
    setIsCustomizing(false);
    setItemNote('');
    setSelectedAdds([]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const toggleAddition = (add: CartAddition) => {
    if (selectedAdds.some((a) => a.id === add.id)) {
      setSelectedAdds(selectedAdds.filter((a) => a.id !== add.id));
    } else {
      setSelectedAdds([...selectedAdds, add]);
    }
  };

  // Determine appropriate icon for category
  const renderCategoryIcon = () => {
    switch (item.icono) {
      case 'Coffee': return <Coffee className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Beer': return <Beer className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Pizza': return <Pizza className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Beef': return <Beef className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Sandwich': return <Sandwich className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Cookie': return <Cookie className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Wine': return <Wine className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'CupSoda': return <CupSoda className="w-3.5 h-3.5 text-[#BA7738]" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-[#BA7738]" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-[#BA7738]" />;
    }
  };

  // Relevant additions for specific categories
  const relevantAdditions = AVAILABLE_ADDITIONS.filter((add) => {
    if (item.categoria.includes('CAFÉ') && add.id === 'add-almendras') return true;
    if (item.categoria.includes('HAMBURGUESAS') || item.categoria.includes('PAPAS')) {
      return add.id === 'add-bacon' || add.id === 'add-cheddar' || add.id === 'add-medallon';
    }
    if (item.categoria.includes('SALADOS') || item.categoria.includes('DULCES')) {
      return add.id.includes('dip');
    }
    return false;
  });

  return (
    <div
      id={`product-card-${item.id}`}
      className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-[#DFD5C6] hover:border-[#BA7738]/60 transition-all duration-300 shadow-xs hover:shadow-md"
    >
      <div>
        {/* Top Header: Category/Subcategory & Tags */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#284233] font-semibold">
            <span className="p-1 rounded-md bg-[#F6EFE5] border border-[#DFD5C6]">
              {renderCategoryIcon()}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[#635B4F] font-bold">
              {item.subcategoria || item.categoria}
            </span>
          </div>

          {item.destacado && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#BA7738]/15 border border-[#BA7738]/40 text-[#BA7738] rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Búnker Pick
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif-brand text-base sm:text-lg font-bold text-[#284233] leading-snug group-hover:text-[#BA7738] transition-colors mb-1.5">
          {item.nombre}
        </h3>

        {/* Description */}
        {item.descripcion && (
          <p className="text-xs text-[#635B4F] leading-relaxed line-clamp-2 mb-3">
            {item.descripcion}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F6EFE5] text-[#4A4338] border border-[#DFD5C6]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Price & Add Actions */}
      <div className="pt-3 border-t border-[#DFD5C6] flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-xs text-[#7A7062] block">Precio</span>
          <span className="font-serif-brand text-lg font-extrabold text-[#284233] tracking-tight">
            {formatPrice(item.precio)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Custom Note button */}
          <button
            id={`btn-customize-${item.id}`}
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="p-2 rounded-xl bg-[#F6EFE5] hover:bg-[#EFE6D8] border border-[#DFD5C6] text-[#4A4338] hover:text-[#BA7738] transition-colors shadow-xs"
            title="Añadir aclaración o adicional"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {/* Quick Add / Stepper */}
          {currentQuantity > 0 && cartEntries.length === 1 && !cartEntries[0].notas && (!cartEntries[0].adicionales || cartEntries[0].adicionales.length === 0) ? (
            <div className="flex items-center bg-[#284233] rounded-xl border border-[#284233] p-0.5 shadow-xs">
              <button
                id={`btn-minus-${item.id}`}
                onClick={() => updateQuantity(cartEntries[0].id, -1)}
                className="p-1.5 rounded-lg text-white hover:bg-black/20 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold text-white">
                {currentQuantity}
              </span>
              <button
                id={`btn-plus-${item.id}`}
                onClick={() => updateQuantity(cartEntries[0].id, 1)}
                className="p-1.5 rounded-lg text-white hover:bg-black/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`btn-add-${item.id}`}
              onClick={handleQuickAdd}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                justAdded
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-[#BA7738] hover:bg-[#A8682D] text-white active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Agregado!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Customization Drawer / Box */}
      {isCustomizing && (
        <div className="mt-3 pt-3 border-t border-[#DFD5C6] rounded-xl bg-[#F8F4EC] p-3 animate-in fade-in slide-in-from-top-2 duration-200 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#284233] flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#BA7738]" /> Aclaración para cocina / barra
            </span>
            <button
              onClick={() => setIsCustomizing(false)}
              className="text-[10px] text-[#7A7062] hover:text-[#284233]"
            >
              Cerrar
            </button>
          </div>

          <input
            type="text"
            placeholder="Ej: Sin cebolla / Poco hielo / Con edulcorante..."
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-lg text-[#284233] placeholder-[#7A7062] outline-none mb-2.5"
          />

          {relevantAdditions.length > 0 && (
            <div className="mb-2.5">
              <span className="text-[11px] font-semibold text-[#4A4338] block mb-1.5">
                Adicionales sugeridos:
              </span>
              <div className="space-y-1">
                {relevantAdditions.map((add) => {
                  const isSelected = selectedAdds.some((a) => a.id === add.id);
                  return (
                    <button
                      key={add.id}
                      type="button"
                      onClick={() => toggleAddition(add)}
                      className={`w-full px-2 py-1 rounded-lg text-left text-xs flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-[#284233] border-[#284233] text-white'
                          : 'bg-white border-[#DFD5C6] text-[#4A4338] hover:border-[#BA7738]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded flex items-center justify-center text-[9px] ${isSelected ? 'bg-[#BA7738] text-white' : 'border border-[#DFD5C6]'}`}>
                          {isSelected && '✓'}
                        </span>
                        {add.nombre}
                      </span>
                      <span className="font-semibold text-[11px]">+{formatPrice(add.precio)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleCustomAdd}
            className="w-full py-1.5 rounded-lg bg-[#284233] hover:bg-[#1E3327] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar al Pedido ({formatPrice(item.precio + selectedAdds.reduce((acc, a) => acc + a.precio, 0))})
          </button>
        </div>
      )}
    </div>
  );
};

