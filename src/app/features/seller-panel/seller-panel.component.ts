import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FYM_ASSETS } from '../../core/constants/app.constants';
import { OrderChatService, SendMessageRequest } from '../../core/services/order-chat.service';
import { ProductPublisherComponent } from './components/product-publisher.component';
import { CashFlowWidgetComponent } from './components/cash-flow-widget.component';
import { InventoryManagerComponent } from './components/inventory-manager.component';
import { OrderDetailPaneComponent } from './components/order-detail-pane.component';

@Component({
  selector: 'app-seller-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductPublisherComponent,
    CashFlowWidgetComponent,
    InventoryManagerComponent,
    OrderDetailPaneComponent
  ],
  templateUrl: './seller-panel.component.html',
  styleUrls: ['./seller-panel.component.scss']
})
export class SellerPanelComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly authService = inject(AuthService);
  readonly chatService = inject(OrderChatService);
  readonly assets = FYM_ASSETS;

  // Control del Menú Lateral (Drawer) de 3 puntos
  isSidebarOpen = signal<boolean>(false);

  activeTab = signal<'tablero' | 'caja' | 'inventario' | 'nuevo-producto'>('tablero');
  ordersFilter = signal<'todos' | 'pendientes' | 'proceso' | 'completados'>('todos');

  orders = signal<any[]>([]);
  cashSummary = signal<any>({
    initialBalance: 2500,
    totalIncome: 14800,
    totalExpense: 3200,
    currentBalance: 14100
  });
  cashMovements = signal<any[]>([
    { id: '1', date: new Date().toISOString(), type: 1, movementCategory: 1, amount: 425, description: 'Abono 50% Pedido #ORD-2026-001 (Ramo Imperial)' },
    { id: '2', date: new Date().toISOString(), type: 1, movementCategory: 0, amount: 180, description: 'Venta directa en taller - Llavero Pixel' },
    { id: '3', date: new Date().toISOString(), type: 2, movementCategory: 2, amount: 650, description: 'Compra fomi escarchado y barras de silicón' },
    { id: '4', date: new Date().toISOString(), type: 1, movementCategory: 1, amount: 600, description: 'Abono 50% Piñata 3D Spiderman' }
  ]);

  materials = signal<any[]>([
    { id: '1', name: 'Limpiapipas Rojo Escarlata', currentStock: 18, minimumAlertStock: 25, unitMeasure: 'Paquetes', isLowStock: true },
    { id: '2', name: 'Listón Satén Terracota 4cm', currentStock: 45, minimumAlertStock: 15, unitMeasure: 'Rollos (25m)', isLowStock: false },
    { id: '3', name: 'Opalina Blanca 240g', currentStock: 8, minimumAlertStock: 10, unitMeasure: 'Resmas', isLowStock: true }
  ]);

  isLoading = signal<boolean>(false);

  // Negociación y Detalle Modal
  selectedOrder = signal<any | null>(null);

  // Segmentación de pedidos según requerimientos:
  // Pendientes a respuesta / por hacer trato: estados 0 (PendingReview) y 1 (Quoted/Accepted)
  pendingDeals = computed(() => this.orders().filter(o => [0, 1].includes(o.status)));
  // En Proceso (con anticipo 50% o en confección activa): estados 2 (ConfirmedDeposit) y 3 (InProduction)
  inProcessDeals = computed(() => this.orders().filter(o => [2, 3].includes(o.status)));
  // Completados / Entregados: estados 4 (ReadyToDeliver) y 5 (Delivered)
  completedDeals = computed(() => this.orders().filter(o => [4, 5].includes(o.status)));

  totalPendingOrders = computed(() => this.pendingDeals().length);
  totalInProcessOrders = computed(() => this.inProcessDeals().length);
  totalCompletedOrders = computed(() => this.completedDeals().length);

  sortedOrders = computed(() => {
    let list = this.orders();
    if (this.ordersFilter() === 'pendientes') list = this.pendingDeals();
    if (this.ordersFilter() === 'proceso') list = this.inProcessDeals();
    if (this.ordersFilter() === 'completados') list = this.completedDeals();

    return [...list].sort((a, b) => {
      const dateA = a.estimatedDeliveryDate ? new Date(a.estimatedDeliveryDate).getTime() : 0;
      const dateB = b.estimatedDeliveryDate ? new Date(b.estimatedDeliveryDate).getTime() : 0;
      return dateA - dateB;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  navigateTab(tab: 'tablero' | 'caja' | 'inventario' | 'nuevo-producto', filter?: 'todos' | 'pendientes' | 'proceso' | 'completados'): void {
    this.activeTab.set(tab);
    if (filter) {
      this.ordersFilter.set(filter);
    }
    this.closeSidebar();
  }

  logout(): void {
    this.closeSidebar();
    this.authService.logout();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.apiService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        if (data.length > 0) this.selectOrder(data[0]);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectOrder(order: any): void {
    this.selectedOrder.set(order);
    const currentUser = this.authService.currentUser();
    const userId = currentUser?.userId || 'admin-user';
    this.chatService.initSignalR(order.id, userId, 'Artisan');
    this.chatService.loadOrderMessages(order.id);
  }

  changeOrderStatus(status: number, statusText: string): void {
    const current = this.selectedOrder();
    if (!current) return;

    this.apiService.updateOrderStatus(current.id, status).subscribe({
      next: () => {
        current.status = status;
        current.statusText = statusText;
        this.selectedOrder.set({ ...current });
        this.orders.update(orders => orders.map(o => o.id === current.id ? { ...o, status, statusText } : o));
      }
    });
  }

  sendArtisanMessage(req: SendMessageRequest) {
    const ord = this.selectedOrder();
    if (!ord) return;

    const payload: SendMessageRequest = {
      ...req,
      orderId: ord.id,
      senderId: this.authService.currentUser()?.userId || 'admin-taller',
      senderName: 'Taller Flor & Más',
      senderRole: 'Artisan'
    };

    this.chatService.sendChatMessage(payload).subscribe({
      next: (msg) => {
        this.chatService.messages.update(prev => [...prev, msg]);
      }
    });
  }

  sendArtisanAttachment(file: File) {
    const ord = this.selectedOrder();
    if (!ord) return;

    const isAudio = file.type.startsWith('audio');
    const contentType: 'Image' | 'Audio' = isAudio ? 'Audio' : 'Image';

    this.chatService.uploadChatAttachment(file).subscribe({
      next: (res) => {
        this.sendArtisanMessage({
          orderId: ord.id,
          senderId: this.authService.currentUser()?.userId || 'admin-taller',
          senderName: 'Taller Flor & Más',
          senderRole: 'Artisan',
          contentType,
          fileUrl: res.url,
          text: isAudio ? 'Nota de audio adjunta' : 'Diseño de muestra adjunto'
        });
      }
    });
  }

  sendFormalProposal(price: number, days: number) {
    const ord = this.selectedOrder();
    if (!ord) return;

    const deposit = Math.round(price * 0.5);

    this.chatService.sendChatMessage({
      orderId: ord.id,
      senderId: this.authService.currentUser()?.userId || 'admin-taller',
      senderName: 'Taller Flor & Más (Administración)',
      senderRole: 'Artisan',
      contentType: 'OfferProposal',
      proposedPrice: price,
      proposedDeposit: deposit,
      proposedDeliveryDays: days,
      text: `Propuesta formal de trato: C$ ${price} con anticipo del 50% (C$ ${deposit}) listo en ${days} días hábiles.`
    }).subscribe({
      next: (msg) => {
        this.chatService.messages.update(prev => [...prev, msg]);
      }
    });
  }

  onArtisanTyping(isTyping: boolean) {
    const ord = this.selectedOrder();
    if (ord) {
      const userId = this.authService.currentUser()?.userId || 'admin-taller';
      this.chatService.sendTypingSignal(ord.id, userId, isTyping);
    }
  }

  onAddCashMovement(event: { type: number; amount: number; description: string }) {
    this.cashMovements.update(prev => [
      {
        id: Math.random().toString(),
        date: new Date().toISOString(),
        type: event.type,
        movementCategory: 1,
        amount: event.amount,
        description: event.description
      },
      ...prev
    ]);
  }

  onProductSaved(): void {
    this.activeTab.set('tablero');
    this.loadData();
  }
}
