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
        <div class="fym-detail-sheet">
          <div class="fym-sheet-header">
            <div>
              <span class="fym-badge-pill fym-badge-custom">Ficha de Trato & Producción</span>
              <h2 class="fym-display">{{ ord.orderNumber }} &bull; {{ ord.customerName }}</h2>
              <span class="fym-sheet-phone">WhatsApp: {{ ord.customerPhone }} &bull; Entrega: {{ ord.deliveryAddress || 'Pendiente' }}</span>
            </div>

            <div class="fym-sheet-total-box">
              <span class="fym-tot-label">Monto Acordado</span>
              <strong class="fym-tot-val">C$ {{ ord.totalAmount | number:'1.2-2' }}</strong>
              <span class="fym-tot-abono">Anticipo 50%: C$ {{ (ord.totalAmount * 0.5) | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Fila de Acciones de Estado de Producción -->
          <div class="fym-status-pipeline">
            <span class="fym-pipeline-label">Estado de la Orden:</span>
            <div class="fym-pipeline-buttons">
              <button class="fym-btn-pipeline quoted" (click)="statusChange.emit({ status: 1, text: 'Cotizado' })">
                Cotizado
              </button>
              <button class="fym-btn-pipeline confirmed" (click)="statusChange.emit({ status: 2, text: 'Confirmado 50%' })">
                Validar Anticipo 50%
              </button>
              <button class="fym-btn-pipeline production" (click)="statusChange.emit({ status: 3, text: 'En Producción' })">
                Pasar a Producción
              </button>
              <button class="fym-btn-pipeline ready" (click)="statusChange.emit({ status: 4, text: 'Listo para Entrega' })">
                Marcar Listo
              </button>
              <button class="fym-btn-pipeline delivered" (click)="statusChange.emit({ status: 5, text: 'Entregado' })">
                Marcar Entregado
              </button>
            </div>
          </div>

          <!-- BANDEJA DE CHAT EN TIEMPO REAL CON EL CLIENTE -->
          <div class="fym-seller-chat-wrapper">
            <div class="fym-chat-proposal-bar">
              <div class="proposal-inputs">
                <div class="input-unit">
                  <label>Precio Final (C$):</label>
                  <input type="number" [ngModel]="offerPrice()" (ngModelChange)="offerPrice.set($event)" placeholder="Monto" />
                </div>
                <div class="input-unit">
                  <label>Días de Elaboración:</label>
                  <input type="number" [ngModel]="offerDays()" (ngModelChange)="offerDays.set($event)" placeholder="Días" />
                </div>
              </div>
              <button class="btn-send-offer" (click)="handleSendProposal()">
                Enviar Propuesta Formal al Chat
              </button>
            </div>

            <div class="chat-embedded-box">
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

          <!-- Factura Digital Vinculada -->
          <div class="fym-invoice-shortcut">
            <a [routerLink]="['/comprobante', ord.id]" class="fym-btn-invoice-link">
              Ver Comprobante Digital / Factura Formal de este Pedido &rarr;
            </a>
          </div>

        </div>
      }
    </main>
  `,
  styles: [`
    .fym-seller-detail-pane {
      display: flex;
      flex-direction: column;
    }
    .fym-detail-sheet {
      background: #FFFFFF;
      border: 1px solid #F1D4DB;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .fym-sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      border-bottom: 1px solid #FFF8F9;
      padding-bottom: 1rem;
    }
    .fym-display {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1A0D12;
      margin: 0.25rem 0;
    }
    .fym-sheet-phone {
      font-size: 0.82rem;
      color: #6E535C;
    }
    .fym-sheet-total-box {
      text-align: right;
      display: flex;
      flex-direction: column;
    }
    .fym-tot-label {
      font-size: 0.75rem;
      color: #6E535C;
      text-transform: uppercase;
    }
    .fym-tot-val {
      font-size: 1.4rem;
      font-weight: 800;
      color: #D9536F;
    }
    .fym-tot-abono {
      font-size: 0.78rem;
      color: #2D6A4F;
      font-weight: 600;
    }
    .fym-badge-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      display: inline-block;
    }
    .fym-badge-custom {
      background: #FDF2F4;
      color: #D9536F;
      border: 1px solid #F1D4DB;
    }
    .fym-status-pipeline {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: #FFF8F9;
      padding: 0.85rem;
      border-radius: 8px;
      border: 1px solid #F1D4DB;
    }
    .fym-pipeline-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #1A0D12;
    }
    .fym-pipeline-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      button {
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid transparent;
        transition: opacity 0.2s;
        &:hover { opacity: 0.85; }
        &.quoted { background: #E0E7FF; color: #3730A3; }
        &.confirmed { background: #FEF3C7; color: #92400E; }
        &.production { background: #FDF2F4; color: #D9536F; border-color: #F1D4DB; }
        &.ready { background: #D1FAE5; color: #065F46; }
        &.delivered { background: #E5E7EB; color: #374151; }
      }
    }
    .fym-seller-chat-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .fym-chat-proposal-bar {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
      background: #FDF2F4;
      border: 1px solid #F1D4DB;
      padding: 0.75rem 1rem;
      border-radius: 8px;
    }
    .proposal-inputs {
      display: flex;
      gap: 1rem;
    }
    .input-unit {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #1A0D12;
      }
      input {
        width: 100px;
        padding: 0.4rem 0.6rem;
        border: 1px solid #F1D4DB;
        border-radius: 6px;
        font-size: 0.85rem;
      }
    }
    .btn-send-offer {
      padding: 0.5rem 1rem;
      background: #D9536F;
      color: #FFFFFF;
      border: none;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }
    .chat-embedded-box {
      border: 1px solid #F1D4DB;
      border-radius: 10px;
      overflow: hidden;
      min-height: 400px;
    }
    .fym-invoice-shortcut {
      text-align: right;
    }
    .fym-btn-invoice-link {
      font-size: 0.82rem;
      color: #D9536F;
      font-weight: 600;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }
    @media (max-width: 900px) {
      .fym-chat-proposal-bar {
        flex-direction: column;
        align-items: stretch;
      }
      .proposal-inputs {
        flex-direction: column;
      }
      .input-unit input {
        width: 100%;
      }
    }
  `]
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
