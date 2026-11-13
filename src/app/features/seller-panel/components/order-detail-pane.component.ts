import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NegotiationChatComponent } from '../../../shared/components/negotiation-chat.component';
import { ChatMessageDto, SendMessageRequest } from '../../../core/services/order-chat.service';

@Component({
  selector: 'app-order-detail-pane',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NegotiationChatComponent],
  template: `
    <main class="fym-seller-detail-pane">
      @if (order(); as ord) {
        <div class="fym-editorial-sheet">
          
          <!-- Encabezado de la Orden -->
          <div class="fym-sheet-header">
            <div class="sheet-main-info">
              <span class="fym-tag-atelier">Ficha de Confección & Negociación</span>
              <h2 class="order-client-heading">{{ ord.orderNumber }} &bull; {{ ord.customerName }}</h2>
              <div class="order-contact-meta">
                <span>Teléfono / WhatsApp: <strong>{{ ord.customerPhone }}</strong></span>
                <span class="bullet-sep">&bull;</span>
                <span>Entrega: <strong>{{ ord.deliveryAddress || 'Por convenir' }}</strong></span>
              </div>
            </div>

            <div class="fym-sheet-deal-box">
              <span class="deal-label">Total Acordado</span>
              <strong class="deal-value">C$ {{ ord.totalAmount | number:'1.2-2' }}</strong>
              <span class="deal-deposit">Anticipo 50%: C$ {{ (ord.totalAmount * 0.5) | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Pipeline de Estado Táctil -->
          <div class="fym-pipeline-card">
            <span class="pipeline-heading">Estado en Taller:</span>
            <div class="pipeline-buttons">
              <button class="btn-step quoted" (click)="statusChange.emit({ status: 1, text: 'Cotizado' })">
                Cotizado
              </button>
              <button class="btn-step confirmed" (click)="statusChange.emit({ status: 2, text: 'Confirmado 50%' })">
                Validar Anticipo 50%
              </button>
              <button class="btn-step in-production" (click)="statusChange.emit({ status: 3, text: 'En Producción' })">
                Pasar a Producción
              </button>
              <button class="btn-step ready" (click)="statusChange.emit({ status: 4, text: 'Listo para Entrega' })">
                Marcar Listo
              </button>
              <button class="btn-step delivered" (click)="statusChange.emit({ status: 5, text: 'Entregado' })">
                Marcar Entregado
              </button>
            </div>
          </div>

          <!-- Bandeja de Negociación y Chat Flotante -->
          <div class="fym-deal-chat-section">
            <div class="deal-proposal-bar">
              <div class="inputs-cluster">
                <div class="input-unit">
                  <label>Precio Final (C$)</label>
                  <input type="number" [ngModel]="offerPrice()" (ngModelChange)="offerPrice.set($event)" placeholder="Monto" />
                </div>
                <div class="input-unit">
                  <label>Tiempo (Días)</label>
                  <input type="number" [ngModel]="offerDays()" (ngModelChange)="offerDays.set($event)" placeholder="Días" />
                </div>
              </div>
              <button class="btn-send-deal" (click)="handleSendProposal()">
                Enviar Propuesta Formal al Chat &rarr;
              </button>
            </div>

            <div class="chat-viewport-box">
              <app-negotiation-chat
                [orderId]="ord.id"
                [orderCode]="ord.orderNumber"
                [targetUserName]="ord.customerName"
                [currentUserRole]="'Artisan'"
                [isOnline]="isOnline()"
                [typingStatus]="typingStatus()"
                [messages]="messages()"
                (onSendMessage)="sendMessage.emit($event)"
                (onSendAttachment)="sendAttachment.emit($event)"
                (onTyping)="typing.emit($event)"
              ></app-negotiation-chat>
            </div>
          </div>

          <!-- Enlace al Comprobante Digital -->
          <div class="fym-sheet-footer">
            <a [routerLink]="['/comprobante', ord.id]" class="fym-link-invoice">
              Ver Comprobante Digital / Factura Formal de este Pedido &rarr;
            </a>
          </div>

        </div>
      }
    </main>
  `,
  styleUrls: ['./order-detail-pane.component.scss']
})
export class OrderDetailPaneComponent {
  order = input.required<any>();
  isOnline = input<boolean>(false);
  typingStatus = input<string | null>(null);
  messages = input<ChatMessageDto[]>([]);

  statusChange = output<{ status: number; text: string }>();
  sendProposal = output<{ price: number; days: number }>();
  sendMessage = output<SendMessageRequest>();
  sendAttachment = output<File>();
  typing = output<boolean>();

  offerPrice = signal<number>(0);
  offerDays = signal<number>(3);

  handleSendProposal() {
    this.sendProposal.emit({
      price: this.offerPrice(),
      days: this.offerDays()
    });
  }
}
