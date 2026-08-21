import React, { useState } from 'react';
import { useCart, WHATSAPP_PHONE } from '../context/CartContext';
import { OrderType, PaymentMethod } from '../types';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, MapPin, Clock, Table, CreditCard, Banknote, QrCode, MessageSquare, AlertCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeItem,
    updateItemNotes,
    clearCart,
    totalCount,
    totalPrice,
    orderDetails,
    updateOrderDetails,
    generateWhatsAppLink,
  } = useCart();

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');
  const [formError, setFormError] = useState('');

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  const handleOpenNoteEditor = (itemId: string, currentNotes?: string) => {
    setEditingNoteId(itemId);
    setTempNote(currentNotes || '');
  };

  const handleSaveNote = (itemId: string) => {
    updateItemNotes(itemId, tempNote);
    setEditingNoteId(null);
    setTempNote('');
  };

  const handleConfirmOrder = () => {
    if (items.length === 0) {
      setFormError('Tu carrito está vacío. Agrega productos de la carta.');
      return;
    }

    if (!orderDetails.customerName.trim()) {
      setFormError('Por favor ingresa tu Nombre para el pedido.');
      return;
    }

    if (orderDetails.orderType === 'delivery' && !orderDetails.address?.trim()) {
      setFormError('Por favor ingresa la Dirección de Entrega para el delivery.');
      return;
    }

    if (orderDetails.orderType === 'mesa' && !orderDetails.tableNumber?.trim()) {
      setFormError('Por favor ingresa el Número de Mesa.');
      return;
    }

    setFormError('');
    const waUrl = generateWhatsAppLink();
    window.open(waUrl, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg h-full bg-[#EFE6D8] border-l border-[#DFD5C6] flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-[#DFD5C6] bg-white flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#284233] text-white">
              <ShoppingBag className="w-5 h-5 text-[#EFE6D8]" />
            </div>
            <div>
              <h2 className="font-serif-brand font-bold text-base text-[#284233]">
                Tu Pedido • Casa Búnker
              </h2>
              <p className="text-xs text-[#635B4F]">
                {totalCount} {totalCount === 1 ? 'producto' : 'productos'} seleccionados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="p-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                title="Vaciar carrito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="btn-close-cart"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-[#F6EFE5] hover:bg-[#EFE6D8] border border-[#DFD5C6] text-[#4A4338] hover:text-[#284233] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white border border-[#DFD5C6] flex items-center justify-center mx-auto mb-4 text-[#BA7738] shadow-xs">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif-brand font-bold text-lg text-[#284233] mb-1">
                Tu pedido está vacío
              </h3>
              <p className="text-xs text-[#635B4F] max-w-xs mx-auto mb-6">
                Explora la carta y agrega tus cafés, hamburguesas, birras tiradas o combos favoritos.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#284233] hover:bg-[#1E3327] text-white text-xs font-bold transition-all shadow-sm"
              >
                Ver Carta Digital
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#BA7738] block">
                  Detalle de Productos:
                </span>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-[#DFD5C6] flex flex-col gap-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-[#284233] block leading-tight">
                          {item.nombre}
                        </span>
                        <span className="text-xs font-semibold text-[#BA7738] mt-0.5 block">
                          {formatPrice(item.precioTotal)}{' '}
                          {item.cantidad > 1 && (
                            <span className="text-[10px] text-[#7A7062] font-normal">
                              ({formatPrice(item.precioUnitario)} c/u)
                            </span>
                          )}
                        </span>

                        {/* Additions badges */}
                        {item.adicionales && item.adicionales.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.adicionales.map((a) => (
                              <span
                                key={a.id}
                                className="px-1.5 py-0.5 rounded text-[9px] bg-[#F6EFE5] border border-[#DFD5C6] text-[#284233] font-medium"
                              >
                                + {a.nombre} ({formatPrice(a.precio)})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes badge */}
                        {item.notas && (
                          <p className="text-[11px] text-[#A8682D] italic mt-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> "{item.notas}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#F6EFE5] rounded-lg border border-[#DFD5C6] p-0.5 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-[#4A4338] hover:text-[#284233] hover:bg-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#284233]">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-[#4A4338] hover:text-[#284233] hover:bg-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Note editor button */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#DFD5C6] text-[11px]">
                      <button
                        onClick={() => handleOpenNoteEditor(item.id, item.notas)}
                        className="text-[#635B4F] hover:text-[#BA7738] flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {item.notas ? 'Editar aclaración' : '+ Agregar aclaración'}
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>

                    {/* Inline note edit box */}
                    {editingNoteId === item.id && (
                      <div className="pt-2 border-t border-[#DFD5C6] flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Ej: Sin hielo / Sin sal / Bien tostado..."
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-[#F8F4EC] border border-[#DFD5C6] rounded-lg text-[#284233] outline-none focus:border-[#BA7738]"
                        />
                        <button
                          onClick={() => handleSaveNote(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#284233] text-white text-xs font-bold"
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Fulfillment Selector */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DFD5C6] space-y-3 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#BA7738] block">
                  ¿Cómo quieres tu pedido?
                </span>

                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F6EFE5] border border-[#DFD5C6]">
                  <button
                    type="button"
                    onClick={() => updateOrderDetails({ orderType: 'takeaway' })}
                    className={`py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      orderDetails.orderType === 'takeaway'
                        ? 'bg-[#284233] text-white shadow-xs'
                        : 'text-[#635B4F] hover:text-[#284233]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Take Away</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateOrderDetails({ orderType: 'delivery' })}
                    className={`py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      orderDetails.orderType === 'delivery'
                        ? 'bg-[#284233] text-white shadow-xs'
                        : 'text-[#635B4F] hover:text-[#284233]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateOrderDetails({ orderType: 'mesa' })}
                    className={`py-2 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      orderDetails.orderType === 'mesa'
                        ? 'bg-[#284233] text-white shadow-xs'
                        : 'text-[#635B4F] hover:text-[#284233]'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>En Mesa</span>
                  </button>
                </div>

                {/* Conditional Fields based on Order Type */}
                {orderDetails.orderType === 'delivery' && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                        Dirección de Entrega *
                      </label>
                      <input
                        type="text"
                        placeholder="Calle y Altura (ej: Av. Estrada 250)"
                        value={orderDetails.address || ''}
                        onChange={(e) => updateOrderDetails({ address: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                          Piso / Depto
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 4to B"
                          value={orderDetails.floorApt || ''}
                          onChange={(e) => updateOrderDetails({ floorApt: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                          Aclaración Envío
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Timbre roto"
                          value={orderDetails.deliveryNotes || ''}
                          onChange={(e) => updateOrderDetails({ deliveryNotes: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {orderDetails.orderType === 'takeaway' && (
                  <div className="pt-1">
                    <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                      Horario Estimado de Retiro
                    </label>
                    <select
                      value={orderDetails.takeawayTime || 'Lo antes posible (15-25 min)'}
                      onChange={(e) => updateOrderDetails({ takeawayTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] outline-none"
                    >
                      <option value="Lo antes posible (15-25 min)">Lo antes posible (15-25 min)</option>
                      <option value="En 30 minutos">En 30 minutos</option>
                      <option value="En 45 minutos">En 45 minutos</option>
                      <option value="En 1 hora">En 1 hora</option>
                    </select>
                    <p className="text-[10px] text-[#635B4F] mt-1">
                      📍 Retiro en barra: Poeta Lugones 412, Nueva Córdoba.
                    </p>
                  </div>
                )}

                {orderDetails.orderType === 'mesa' && (
                  <div className="pt-1">
                    <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                      Número de Mesa *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Mesa 4 / Barra 2"
                      value={orderDetails.tableNumber || ''}
                      onChange={(e) => updateOrderDetails({ tableNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Customer Contact & Payment */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DFD5C6] space-y-3 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#BA7738] block">
                  Datos de Contacto y Pago
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre y Apellido"
                      value={orderDetails.customerName}
                      onChange={(e) => updateOrderDetails({ customerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#4A4338] block mb-1">
                      Teléfono WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 351 872 5482"
                      value={orderDetails.customerPhone}
                      onChange={(e) => updateOrderDetails({ customerPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-[#4A4338] block mb-1.5">
                    Forma de Pago
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateOrderDetails({ paymentMethod: 'efectivo' })}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                        orderDetails.paymentMethod === 'efectivo'
                          ? 'bg-[#284233] border-[#284233] text-white'
                          : 'bg-[#F6EFE5] border-[#DFD5C6] text-[#4A4338] hover:text-[#284233]'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Efectivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateOrderDetails({ paymentMethod: 'transferencia' })}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                        orderDetails.paymentMethod === 'transferencia'
                          ? 'bg-[#284233] border-[#284233] text-white'
                          : 'bg-[#F6EFE5] border-[#DFD5C6] text-[#4A4338] hover:text-[#284233]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Transferencia</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateOrderDetails({ paymentMethod: 'mercadopago' })}
                      className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                        orderDetails.paymentMethod === 'mercadopago'
                          ? 'bg-[#284233] border-[#284233] text-white'
                          : 'bg-[#F6EFE5] border-[#DFD5C6] text-[#4A4338] hover:text-[#284233]'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>MercadoPago</span>
                    </button>
                  </div>

                  {orderDetails.paymentMethod === 'efectivo' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="¿Con cuánto abonas? (para calcular el vuelto)"
                        value={orderDetails.cashChangeAmount || ''}
                        onChange={(e) => updateOrderDetails({ cashChangeAmount: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#DFD5C6] focus:border-[#BA7738] rounded-lg text-[#284233] placeholder-[#7A7062] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#DFD5C6] bg-white space-y-3 shadow-sm">
            {formError && (
              <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#635B4F] block">Total a Pagar</span>
                <span className="text-[11px] text-[#BA7738] font-bold">Sin costo adicional</span>
              </div>
              <span className="font-serif-brand text-2xl font-extrabold text-[#284233]">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              id="btn-confirm-whatsapp"
              onClick={handleConfirmOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar y Enviar Pedido vía WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-[#7A7062]">
              Se abrirá WhatsApp con el detalle listo para enviar a Casa Búnker (+54 9 351 872-5482)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

