export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isCustomizable: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  stockQuantity: number;
  isAvailable: boolean;
  commercialType: 'Available' | 'CustomMade';
  imageUrlsJson: string;
}

export interface ProductExtra {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
  requiresCustomText: boolean;
  allowedCategorySlugsJson: string;
}

export interface OrderItemExtraRequest {
  extraName: string;
  additionalPrice: number;
  customText?: string;
}

export interface OrderItemRequest {
  productId?: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  configurationJson: string;
  extras?: OrderItemExtraRequest[];
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  estimatedDeliveryDate?: string;
  deliveryTimeSlot?: string;
  recipientName?: string;
  deliveryFee: number;
  items: OrderItemRequest[];
}
