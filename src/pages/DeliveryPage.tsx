import React, { useState } from 'react';
import { useCart, WHATSAPP_PHONE } from '../context/CartContext';
import { OrderType, PaymentMethod } from '../types';
import { ArrowLeft, ShoppingBag, MapPin, Clock, Table, CreditCard, Banknote, QrCode, Send, MessageSquare, Plus, Minus, Trash2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface DeliveryPageProps {
  onNavigate: (route: 'hub' | 'carta' | 'delivery') => void;
}

export const DeliveryPage: React.FC<DeliveryPageProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    updateItemNotes,
    totalCount,
    totalPrice,
    orderDetails,
    updateOrderDetails,
    generateWhatsAppLink,
  } = useCart();

  const [formError, setFormError] = useState('');
  const [isCopiedAlias, setIsCopiedAlias] = useState(false);

  const formatPrice = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('CASA.BUNKER.CBA');
    setIsCopiedAlias(true);
    setTimeout(() => setIsCopiedAlias(false), 2000);
  };

  const handleConfirmOrder = () => {
    if (items.length === 0) {
      setFormError('Tu pedido no tiene productos. Agrega opciones desde la carta.');
      return;
    }

    if (!orderDetails.customerName.trim()) {
      setFormError('Por favor ingresa tu Nombre y Apellido.');
      return;
    }

    if (orderDetails.orderType === 'delivery' && !orderDetails.address?.trim()) {
      setFormError('Por favor ingresa la Dirección de entrega completa.');
      return;
    }

    if (orderDetails.orderType === 'mesa' && !orderDetails.tableNumber?.trim()) {
      setFormError('Por favor ingresa el Número de Mesa donde te encuentras.');
      return;
    }

    setFormError('');
    const waUrl = generateWhatsAppLink();
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-4xl mx-auto pb-24">
      {/* Back button & Page Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => onNavigate('carta')}
          className="p-2 rounded-xl bg-white hover:bg-[#F6EFE5] border border-[#DFD5C6] text-[#284233] hover:text-[#BA7738] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Carta</span>
        </button>

        <div>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-extrabold text-[#284233]">
            Confirmar Pedido & Checkout
          </h1>
          <p className="text-xs text-[#635B4F]">
            CASA BÚNKER • Envíos directos, retiro en local o atención en mesa
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#DFD5C6] p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F6EFE5] border border-[#DFD5C6] flex items-center justify-center mx-auto mb-4 text-[#BA7738]">
            <ShoppingBag className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-serif-brand font-bold text-xl text-[#284233] mb-2">
            No tienes productos en tu pedido
          </h2>
          <p className="text-xs text-[#635B4F] mb-6">
            Selecciona cafés, smash burgers, birras artesanales o combos desde nuestra carta digital.
          </p>
          <button
            onClick={() => onNavigate('carta')}
            className="w-full py-3 rounded-xl bg-[#BA7738] hover:bg-[#A8682D] text-white font-extrabold text-xs transition-all shadow-sm"
          >
            Explorar Carta Digital
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Fulfillment & Customer Details Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Fulfillment Selector */}
            <div className="p-5 rounded-2xl bg-white border border-[#DFD5C6] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#BA7738] text-white text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif-brand font-bold text-base text-[#284233]">
                  Tipo de Entrega
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#F6EFE5] border border-[#DFD5C6]">
                <button
                  type="button"
                  onClick={() => updateOrderDetails({ orderType: 'takeaway' })}
                  className={`py-3 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    orderDetails.orderType === 'takeaway'
                      ? 'bg-[#284233] text-white shadow-xs'
                      : 'text-[#635B4F] hover:text-[#284233]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Take Away</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateOrderDetails({ orderType: 'delivery' })}
                  className={`py-3 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    orderDetails.orderType === 'delivery'
                      ? 'bg-[#284233] text-white shadow-xs'
                      : 'text-[#635B4F] hover:text-[#284233]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateOrderDetails({ orderType: 'mesa' })}
                  className={`py-3 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    orderDetails.orderType === 'mesa'
                      ? 'bg-[#284233] text-white shadow-xs'
                      : 'text-[#635B4F] hover:text-[#284233]'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  <span>En Mesa</span>
                </button>
              </div>

              {/* Conditional Inputs */}
              {orderDetails.orderType === 'delivery' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                      Dirección de Entrega en Córdoba *
                    </label>
                    <input
                      type="text"
                      placeholder="Calle y Número (ej: Obispo Trejo 1050)"
                      value={orderDetails.address || ''}
                      onChange={(e) => updateOrderDetails({ address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                        Piso / Departamento
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 3° A"
                        value={orderDetails.floorApt || ''}
                        onChange={(e) => updateOrderDetails({ floorApt: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                        Aclaración al Cadete
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Timbre Búho"
                        value={orderDetails.deliveryNotes || ''}
                        onChange={(e) => updateOrderDetails({ deliveryNotes: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {orderDetails.orderType === 'takeaway' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                    Horario de Retiro en Local
                  </label>
                  <select
                    value={orderDetails.takeawayTime || 'Lo antes posible (15-25 min)'}
                    onChange={(e) => updateOrderDetails({ takeawayTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] outline-none"
                  >
                    <option value="Lo antes posible (15-25 min)">Lo antes posible (15-25 min)</option>
                    <option value="En 30 minutos">En 30 minutos</option>
                    <option value="En 45 minutos">En 45 minutos</option>
                    <option value="En 1 hora">En 1 hora</option>
                  </select>
                  <p className="text-[11px] text-[#635B4F]">
                    📍 Dirección de retiro: Poeta Lugones 412, Nueva Córdoba.
                  </p>
                </div>
              )}

              {orderDetails.orderType === 'mesa' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                    Número de Mesa en Casa Búnker *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Mesa 3 / Barra Principal"
                    value={orderDetails.tableNumber || ''}
                    onChange={(e) => updateOrderDetails({ tableNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                  />
                  <p className="text-[11px] text-[#635B4F]">
                    Llevamos tu pedido directamente a la mesa indicada.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Contact Information */}
            <div className="p-5 rounded-2xl bg-white border border-[#DFD5C6] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#BA7738] text-white text-xs font-extrabold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif-brand font-bold text-base text-[#284233]">
                  Datos de Contacto
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={orderDetails.customerName}
                    onChange={(e) => updateOrderDetails({ customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A4338] block mb-1">
                    Teléfono WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 351 872 5482"
                    value={orderDetails.customerPhone}
                    onChange={(e) => updateOrderDetails({ customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-5 rounded-2xl bg-white border border-[#DFD5C6] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#BA7738] text-white text-xs font-extrabold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-serif-brand font-bold text-base text-[#284233]">
                  Medio de Pago
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateOrderDetails({ paymentMethod: 'efectivo' })}
                  className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                    orderDetails.paymentMethod === 'efectivo'
                      ? 'bg-[#284233] border-[#284233] text-white shadow-xs'
                      : 'bg-[#F6EFE5] border-[#DFD5C6] text-[#4A4338] hover:text-[#284233]'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Efectivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateOrderDetails({ paymentMethod: 'transferencia' })}
                  className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                    orderDetails.paymentMethod === 'transferencia'
                      ? 'bg-[#284233] border-[#284233] text-white shadow-xs'
                      : 'bg-[#F6EFE5] border-[#DFD5C6] text-[#4A4338] hover:text-[#284233]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Transferencia</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateOrderDetails({ paymentMethod: 'mercadopago' })}
                  className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                    orderDetails.paymentMethod === 'mercadopago'
                      ? 'bg-[#284233] border-[#284233] text-white shadow-xs'
                      : 'bg-[#F6EFE5] border-[#DFD5C6] text-[#4A4338] hover:text-[#284233]'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>MercadoPago</span>
                </button>
              </div>

              {/* Transfer Details Card */}
              {orderDetails.paymentMethod === 'transferencia' && (
                <div className="p-3.5 rounded-xl bg-[#F8F4EC] border border-[#DFD5C6] space-y-2 text-xs">
                  <span className="font-bold text-[#284233] block">
                    Datos para Transferencia:
                  </span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#DFD5C6]">
                    <div>
                      <span className="text-[10px] text-[#635B4F] block">Alias Bancario:</span>
                      <span className="font-mono font-bold text-sm text-[#284233]">CASA.BUNKER.CBA</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAlias}
                      className="px-2.5 py-1 rounded-lg bg-[#284233] text-white text-[11px] font-bold"
                    >
                      {isCopiedAlias ? '¡Copiado!' : 'Copiar Alias'}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#635B4F]">
                    Al confirmar el pedido por WhatsApp, adjunta el comprobante de transferencia.
                  </p>
                </div>
              )}

              {/* Cash Amount Card */}
              {orderDetails.paymentMethod === 'efectivo' && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-[#4A4338] block">
                    ¿Con cuánto vas a pagar? (para calcular el vuelto)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: $ 30.000 / Exacto"
                    value={orderDetails.cashChangeAmount || ''}
                    onChange={(e) => updateOrderDetails({ cashChangeAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F4EC] border border-[#DFD5C6] focus:border-[#BA7738] rounded-xl text-[#284233] placeholder-[#7A7062] outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & WhatsApp Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-[#DFD5C6] sticky top-24 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFD5C6]">
                <h3 className="font-serif-brand font-bold text-lg text-[#284233]">
                  Resumen de tu Pedido
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#284233] text-white">
                  {totalCount} items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#F8F4EC] border border-[#DFD5C6] flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[#284233] block">
                          {item.cantidad}x {item.nombre}
                        </span>
                        {item.adicionales && item.adicionales.length > 0 && (
                          <span className="text-[10px] text-[#BA7738] block font-medium">
                            Extras: {item.adicionales.map((a) => a.nombre).join(', ')}
                          </span>
                        )}
                        {item.notas && (
                          <span className="text-[10px] text-[#A8682D] italic block">
                            Nota: "{item.notas}"
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-[#284233] shrink-0">
                        {formatPrice(item.precioTotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#DFD5C6]">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded text-[#635B4F] hover:text-[#284233] bg-white border border-[#DFD5C6]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold px-1.5 text-[#284233]">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded text-[#635B4F] hover:text-[#284233] bg-white border border-[#DFD5C6]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-[11px]"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-3 border-t border-[#DFD5C6] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#635B4F]">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-[#635B4F]">
                  <span>Modo</span>
                  <span className="capitalize font-semibold text-[#284233]">
                    {orderDetails.orderType === 'takeaway' ? 'Retiro en Local' : orderDetails.orderType === 'delivery' ? 'Delivery a Domicilio' : 'En Mesa'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-[#284233] pt-2 border-t border-[#DFD5C6]">
                  <span className="font-serif-brand text-lg">Total a Pagar</span>
                  <span className="font-serif-brand text-xl font-extrabold text-[#BA7738]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Confirm WhatsApp Button */}
              <button
                id="btn-confirm-checkout-page"
                onClick={handleConfirmOrder}
                className="w-full py-4 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar y Enviar Pedido vía WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A7062] text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Atención directa en barra (+54 9 351 872-5482)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

