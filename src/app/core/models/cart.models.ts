export interface CartItemModel {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productPrimaryImage: string;
  productVariantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  selectedAttributesJson?: string;
  customDedication?: string;
}

export interface CartModel {
  cartId: string;
  items: CartItemModel[];
  itemCount: number;
  total: number;
  lastActivityAt: string;
}

export interface CustomerAddressModel {
  id?: string;
  customerId: string;
  recipientName: string;
  phone: string;
  department: string;
  municipality: string;
  detailedAddress: string;
  referencePoint?: string;
  isDefault: boolean;
  postalCode?: string;
}
