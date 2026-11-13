import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { OrderChatService, ChatMessageDto, SendMessageRequest } from '../../core/services/order-chat.service';
import { NegotiationChatComponent } from '../../shared/components/negotiation-chat.component';

@Component({
  selector: 'app-orders-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NegotiationChatComponent],
  templateUrl: './orders-tracking.component.html',
  styleUrls: ['./orders-tracking.component.scss']
})
export class OrdersTrackingComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly chatService = inject(OrderChatService);

  orders = signal<any[]>([]);
  activeOrder = signal<any | null>(null);
  currentCustomerName = signal<string>('Cliente');
  currentCustomerPhone = signal<string>('');

  // Pestaña de filtrado: 'trato_cerrado' | 'pendientes' | 'todos'
  selectedFilter = signal<'todos' | 'tratos_cerrados' | 'pendientes'>('todos');

  // Separación inteligente de pedidos
  closedDeals = computed(() => {
    return this.orders().filter(o => [2, 3, 4, 5].includes(o.status)); // Confirmado 50%, En Producción, Listo, Entregado
  });

  pendingDeals = computed(() => {
    return this.orders().filter(o => [0, 1].includes(o.status)); // PendingReview, Accepted / Quoted
  });

  filteredOrders = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'tratos_cerrados') return this.closedDeals();
    if (filter === 'pendientes') return this.pendingDeals();
    return this.orders();
  });

  // Estado del Cierre de Trato
  isQuoteAccepted = signal<boolean>(false);
  recipientName = signal<string>('');
  exactAddress = signal<string>('');
  deliveryTime = signal<string>('Tarde (2:00 PM - 5:00 PM)');
  appliesDelivery = signal<boolean>(true);
  deliveryFee = signal<number>(120);

  // Subida de Comprobante / Voucher del 50%
  uploadedVoucherName = signal<string>('');
  isSubmittingProof = signal<boolean>(false);
  proofSuccess = signal<boolean>(false);

  ngOnInit(): void {
    const savedCustomer = localStorage.getItem('fym_customer_profile');
    if (savedCustomer) {
      try {
        const c = JSON.parse(savedCustomer);
        this.currentCustomerPhone.set(c.phone || '');
        this.currentCustomerName.set(`${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Cliente');
        this.recipientName.set(this.currentCustomerName());
        this.exactAddress.set(c.address || '');
      } catch (e) {}
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.apiService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        if (data.length > 0) {
          this.selectOrder(data[0]);
        }
      },
      error: (err) => console.error(err)
    });
  }

  selectOrder(ord: any) {
    this.activeOrder.set(ord);
    this.isQuoteAccepted.set(ord.status >= 2);
    this.proofSuccess.set(ord.status >= 2);

    // Inicializar chat en tiempo real con SignalR
    this.chatService.initSignalR(ord.id, this.currentCustomerPhone() || 'demo-client', 'Client');
    this.chatService.loadOrderMessages(ord.id);
  }

  onSendMessage(payload: SendMessageRequest) {
    payload.senderId = this.currentCustomerPhone() || 'demo-client';
    payload.senderName = this.currentCustomerName();
    payload.senderRole = 'Client';

    this.chatService.sendChatMessage(payload).subscribe({
      next: () => {
        this.chatService.loadOrderMessages(payload.orderId);
      },
      error: () => {}
    });
  }

  onSendAttachment(file: File) {
    const ord = this.activeOrder();
    if (!ord) return;

    this.chatService.uploadChatAttachment(file).subscribe({
      next: (res) => {
        this.onSendMessage({
          orderId: ord.id,
          senderId: this.currentCustomerPhone() || 'demo-client',
          senderName: this.currentCustomerName(),
          senderRole: 'Client',
          contentType: 'Image',
          fileUrl: res.url,
          text: `Envío foto de referencia: ${file.name}`
        });
      },
      error: () => alert('No se pudo subir la imagen al CDN.')
    });
  }

  onTyping(isTyping: boolean) {
    const ord = this.activeOrder();
    if (ord) {
      this.chatService.sendTypingSignal(ord.id, this.currentCustomerPhone() || 'demo-client', isTyping);
    }
  }

  onAcceptOffer(proposalMsg: ChatMessageDto) {
    this.isQuoteAccepted.set(true);
    const ord = this.activeOrder();
    if (ord && proposalMsg.proposedPrice) {
      ord.totalAmount = proposalMsg.proposedPrice;
    }
  }

  onVoucherFile(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.uploadedVoucherName.set(file.name);
      this.chatService.uploadChatAttachment(file).subscribe({
        next: (res) => {
          this.uploadedVoucherName.set(res.url);
        },
        error: () => {}
      });
    }
  }

  confirmVoucherUpload() {
    if (!this.uploadedVoucherName()) {
      alert('Por favor selecciona la captura o comprobante bancario.');
      return;
    }

    this.isSubmittingProof.set(true);
    const ord = this.activeOrder();
    const amount = ord ? (ord.totalAmount * 0.5) : 425;

    this.apiService.submitPaymentProof(
      ord?.id || 'demo-order',
      amount,
      1,
      this.uploadedVoucherName()
    ).subscribe({
      next: () => {
        this.isSubmittingProof.set(false);
        this.proofSuccess.set(true);
        if (ord) ord.status = 2; // Confirmado 50%
      },
      error: () => {
        this.isSubmittingProof.set(false);
        this.proofSuccess.set(true);
        if (ord) ord.status = 2;
      }
    });
  }

  getStatusBadgeClass(statusText: string): string {
    switch (statusText?.toLowerCase()) {
      case 'entregado': return 'status-delivered';
      case 'en producción':
      case 'en produccion': return 'status-production';
      case 'confirmado 50%': return 'status-confirmed';
      case 'cotizado': return 'status-quoted';
      default: return 'status-pending';
    }
  }
}
