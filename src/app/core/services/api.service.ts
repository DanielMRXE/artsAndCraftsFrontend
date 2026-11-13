import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product, ProductExtra, CreateOrderRequest } from '../models/catalog.models';
import { FYM_API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = FYM_API_ENDPOINTS.BASE_URL;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}${FYM_API_ENDPOINTS.CATALOG_CATEGORIES}`);
  }

  getProducts(categorySlug?: string, commercialType?: string): Observable<Product[]> {
    let url = `${this.baseUrl}${FYM_API_ENDPOINTS.CATALOG_PRODUCTS}`;
    const params: string[] = [];
    if (categorySlug) params.push(`categorySlug=${encodeURIComponent(categorySlug)}`);
    if (commercialType) params.push(`commercialType=${encodeURIComponent(commercialType)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<Product[]>(url);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}${FYM_API_ENDPOINTS.CATALOG_PRODUCTS}/${slug}`);
  }

  getExtras(): Observable<ProductExtra[]> {
    return this.http.get<ProductExtra[]>(`${this.baseUrl}${FYM_API_ENDPOINTS.CATALOG_EXTRAS}`);
  }

  submitCustomOrder(request: CreateOrderRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${FYM_API_ENDPOINTS.ORDERS_CUSTOM}`, request);
  }

  submitPaymentProof(orderId: string, amount: number, paymentMethod: number, proofFileUrl: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${FYM_API_ENDPOINTS.ORDERS}/${orderId}/payments/proof`, {
      amount,
      paymentMethod,
      proofFileUrl
    });
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${FYM_API_ENDPOINTS.ORDERS}/${id}`);
  }

  getOrders(status?: number): Observable<any[]> {
    let url = `${this.baseUrl}${FYM_API_ENDPOINTS.ORDERS}`;
    if (status !== undefined) url += `?status=${status}`;
    return this.http.get<any[]>(url);
  }

  getCashSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${FYM_API_ENDPOINTS.CASHFLOW_SUMMARY}`);
  }

  getCashMovements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${FYM_API_ENDPOINTS.CASHFLOW_MOVEMENTS}`);
  }

  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${FYM_API_ENDPOINTS.INVENTORY_MATERIALS}`);
  }

  updateOrderStatus(orderId: string, status: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${FYM_API_ENDPOINTS.ORDERS}/${orderId}/status`, { status });
  }
}
