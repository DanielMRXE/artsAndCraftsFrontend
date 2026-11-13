import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { FYM_API_ENDPOINTS } from '../constants/app.constants';
import { CartItemModel, CartModel } from '../models/cart.models';

const STORAGE_SESSION_KEY = 'fym_cart_session_id';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly cart = signal<CartModel>({
    cartId: '',
    items: [],
    itemCount: 0,
    total: 0,
    lastActivityAt: new Date().toISOString()
  });

  readonly isDrawerOpen = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly totalItems = computed(() => this.cart().itemCount);
  readonly subtotal = computed(() => this.cart().total);
  readonly isEmpty = computed(() => this.cart().items.length === 0);

  constructor() {
    this.ensureSessionId();
    this.loadCart();
  }

  get sessionId(): string {
    return localStorage.getItem(STORAGE_SESSION_KEY) || this.ensureSessionId();
  }

  private ensureSessionId(): string {
    let sid = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem(STORAGE_SESSION_KEY, sid);
    }
    return sid;
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update(v => !v);
  }

  loadCart(): void {
    const customerId = this.auth.currentUser()?.userId;
    let url = `${FYM_API_ENDPOINTS.BASE_URL}/cart?anonymousSessionId=${this.sessionId}`;
    if (customerId) {
      url += `&customerId=${customerId}`;
    }

    this.isLoading.set(true);
    this.http.get<CartModel>(url).subscribe({
      next: (data) => {
        this.cart.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  addItem(productId: string, variantId?: string, quantity: number = 1, dedication?: string, attributesJson?: string): void {
    this.isLoading.set(true);
    const customerId = this.auth.currentUser()?.userId;
    const body = {
      productId,
      productVariantId: variantId || null,
      quantity,
      selectedAttributesJson: attributesJson || '{}',
      customDedication: dedication || null,
      anonymousSessionId: this.sessionId,
      customerId: customerId || null
    };

    this.http.post<CartModel>(`${FYM_API_ENDPOINTS.BASE_URL}/cart/items`, body).subscribe({
      next: (updatedCart) => {
        this.cart.set(updatedCart);
        this.isLoading.set(false);
        this.openDrawer();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    this.isLoading.set(true);
    this.http.put(`${FYM_API_ENDPOINTS.BASE_URL}/cart/items/${itemId}`, { quantity: newQuantity }).subscribe({
      next: () => {
        this.loadCart();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  removeItem(itemId: string): void {
    this.isLoading.set(true);
    this.http.delete(`${FYM_API_ENDPOINTS.BASE_URL}/cart/items/${itemId}`).subscribe({
      next: () => {
        this.loadCart();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
