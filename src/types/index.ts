export interface MenuItem {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  subcategoria?: string;
  descripcion?: string;
  imageUrl?: string;
  tags?: string[];
  icono?: string;
  destacado?: boolean;
  disponible?: boolean;
}

export interface CartAddition {
  id: string;
  nombre: string;
  precio: number;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItemId: string;
  nombre: string;
  precioBase: number;
  precioUnitario: number;
  precioTotal: number;
  cantidad: number;
  notas?: string;
  adicionales?: CartAddition[];
  categoria: string;
}

export type OrderType = 'delivery' | 'takeaway' | 'mesa';
export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago';

export interface OrderDetails {
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  address?: string;
  floorApt?: string;
  deliveryNotes?: string;
  takeawayTime?: string;
  tableNumber?: string;
  paymentMethod: PaymentMethod;
  cashChangeAmount?: string;
}

export interface MozoMessage {
  id: string;
  sender: 'user' | 'mozo';
  text: string;
  timestamp: string;
  suggestedItems?: MenuItem[];
  quickActions?: string[];
  isThinking?: boolean;
  whatsappUrl?: string;
  orderSummary?: {
    nombre?: string;
    detalle?: string;
    ubicacion?: string;
    pago?: string;
  };
}

export interface CategoryInfo {
  id: string;
  nombre: string;
  subtitulo: string;
  imageUrl: string;
  iconName: string;
  subcategorias?: string[];
  badge?: string;
}
