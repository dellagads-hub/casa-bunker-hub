import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, OrderDetails, OrderType, PaymentMethod, CartAddition } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number, notes?: string, additions?: CartAddition[]) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  updateItemNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  orderDetails: OrderDetails;
  updateOrderDetails: (details: Partial<OrderDetails>) => void;
  generateWhatsAppLink: () => string;
  generateWhatsAppText: () => string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMozoOpen: boolean;
  setIsMozoOpen: (open: boolean) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'casa_bunker_cart_v1';
const ORDER_STORAGE_KEY = 'casa_bunker_order_v1';
export const WHATSAPP_PHONE = '5493518725482';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      orderType: 'takeaway' as OrderType,
      customerName: '',
      customerPhone: '',
      address: '',
      floorApt: '',
      deliveryNotes: '',
      takeawayTime: 'Lo antes posible (15-25 min)',
      tableNumber: '',
      paymentMethod: 'efectivo' as PaymentMethod,
      cashChangeAmount: '',
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMozoOpen, setIsMozoOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderDetails));
    } catch {
      // Ignore storage errors
    }
  }, [orderDetails]);

  const addItem = (
    item: MenuItem,
    quantity = 1,
    notes = '',
    additions: CartAddition[] = []
  ) => {
    const additionsKey = additions
      .map((a) => a.id)
      .sort()
      .join(',');
    const itemKey = `${item.id}-${notes.trim()}-${additionsKey}`;

    const additionsTotal = additions.reduce((acc, a) => acc + a.precio, 0);
    const unitPrice = item.precio + additionsTotal;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].cantidad + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: newQty,
          precioTotal: newQty * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          menuItemId: item.id,
          nombre: item.nombre,
          precioBase: item.precio,
          precioUnitario: unitPrice,
          precioTotal: unitPrice * quantity,
          cantidad: quantity,
          notas: notes.trim() || undefined,
          adicionales: additions.length > 0 ? additions : undefined,
          categoria: item.categoria,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.cantidad + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              cantidad: newQty,
              precioTotal: newQty * item.precioUnitario,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateItemNotes = (cartItemId: string, notes: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, notas: notes.trim() || undefined } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateOrderDetails = (details: Partial<OrderDetails>) => {
    setOrderDetails((prev) => ({ ...prev, ...details }));
  };

  const totalCount = items.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.precioTotal, 0);

  const formatCurrency = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  const generateWhatsAppText = () => {
    if (items.length === 0) return '';

    const lines: string[] = [];
    lines.push(`🍻 *NUEVO PEDIDO - CASA BÚNKER (Bar & Café)*`);
    lines.push(`📍 *Poeta Lugones 412, Nva Córdoba*`);
    lines.push(`─────────────────────────`);

    if (orderDetails.orderType === 'mesa') {
      lines.push(`🪑 *MODO: PEDIDO EN MESA*`);
      lines.push(`👉 *Mesa N°:* ${orderDetails.tableNumber || selectedTable || 'No especificada'}`);
    } else if (orderDetails.orderType === 'delivery') {
      lines.push(`🛵 *MODO: DELIVERY A DOMICILIO*`);
      lines.push(`📍 *Dirección:* ${orderDetails.address || 'No indicada'}`);
      if (orderDetails.floorApt) {
        lines.push(`🏢 *Piso/Depto:* ${orderDetails.floorApt}`);
      }
      if (orderDetails.deliveryNotes) {
        lines.push(`📝 *Aclaración Envío:* ${orderDetails.deliveryNotes}`);
      }
    } else {
      lines.push(`🛍️ *MODO: RETIRO EN LOCAL (Take Away)*`);
      lines.push(`⏰ *Horario Retiro:* ${orderDetails.takeawayTime || 'Lo antes posible'}`);
    }

    lines.push(`─────────────────────────`);
    lines.push(`👤 *Cliente:* ${orderDetails.customerName || 'Cliente'}`);
    if (orderDetails.customerPhone) {
      lines.push(`📱 *Teléfono:* ${orderDetails.customerPhone}`);
    }

    lines.push(`\n📋 *DETALLE DEL PEDIDO:*`);
    items.forEach((item, index) => {
      lines.push(`• *${item.cantidad}x* ${item.nombre} - ${formatCurrency(item.precioTotal)}`);
      if (item.adicionales && item.adicionales.length > 0) {
        const adds = item.adicionales.map((a) => `+ ${a.nombre} (${formatCurrency(a.precio)})`).join(', ');
        lines.push(`   └ Extras: _${adds}_`);
      }
      if (item.notas) {
        lines.push(`   └ Nota: _"${item.notas}"_`);
      }
    });

    lines.push(`─────────────────────────`);
    lines.push(`💰 *TOTAL A PAGAR: ${formatCurrency(totalPrice)}*`);
    
    let paymentDesc = 'Efectivo';
    if (orderDetails.paymentMethod === 'transferencia') paymentDesc = 'Transferencia Bancaria (Alias)';
    if (orderDetails.paymentMethod === 'mercadopago') paymentDesc = 'Mercado Pago (Link / QR)';
    lines.push(`💳 *Forma de Pago:* ${paymentDesc}`);
    
    if (orderDetails.paymentMethod === 'efectivo' && orderDetails.cashChangeAmount) {
      lines.push(`💵 *Abona con:* $${orderDetails.cashChangeAmount}`);
    }

    lines.push(`\n✨ _Pedido generado desde la Carta Digital de Casa Búnker_`);

    return lines.join('\n');
  };

  const generateWhatsAppLink = () => {
    const text = generateWhatsAppText();
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        updateItemNotes,
        clearCart,
        totalCount,
        totalPrice,
        orderDetails,
        updateOrderDetails,
        generateWhatsAppLink,
        generateWhatsAppText,
        isCartOpen,
        setIsCartOpen,
        isMozoOpen,
        setIsMozoOpen,
        selectedTable,
        setSelectedTable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
