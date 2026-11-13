import { Routes } from '@angular/router';
import { sellerGuard } from './core/guards/auth.guard';
import { customerAuthGuard } from './core/guards/customer-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'personalizar/:slug',
    loadComponent: () => import('./features/customizer/customizer.component').then(m => m.CustomizerComponent)
  },
  {
    path: 'personalizar',
    loadComponent: () => import('./features/customizer/customizer.component').then(m => m.CustomizerComponent)
  },
  {
    path: 'pedidos',
    canActivate: [customerAuthGuard],
    loadComponent: () => import('./features/orders-tracking/orders-tracking.component').then(m => m.OrdersTrackingComponent)
  },
  {
    path: 'panel-taller',
    canActivate: [sellerGuard],
    loadComponent: () => import('./features/seller-panel/seller-panel.component').then(m => m.SellerPanelComponent)
  },
  {
    path: 'comprobante/:id',
    loadComponent: () => import('./features/invoice/invoice.component').then(m => m.InvoiceComponent)
  },
  {
    path: 'comprobante',
    loadComponent: () => import('./features/invoice/invoice.component').then(m => m.InvoiceComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
