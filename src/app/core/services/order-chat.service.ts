import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { FYM_API_ENDPOINTS } from '../constants/app.constants';

export interface ChatMessageDto {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'Client' | 'Artisan' | 'Admin';
  contentType: 'Text' | 'Image' | 'Audio' | 'OfferProposal';
  text?: string;
  fileUrl?: string;
  proposedPrice?: number;
  proposedDeposit?: number;
  proposedDeliveryDays?: number;
  isOfferAccepted?: boolean;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface SendMessageRequest {
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: 'Client' | 'Artisan' | 'Admin';
  contentType: 'Text' | 'Image' | 'Audio' | 'OfferProposal';
  text?: string;
  fileUrl?: string;
  proposedPrice?: number;
  proposedDeposit?: number;
  proposedDeliveryDays?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderChatService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = FYM_API_ENDPOINTS.BASE_URL;
  private hubConnection: signalR.HubConnection | null = null;

  messages = signal<ChatMessageDto[]>([]);
  isOtherUserOnline = signal<boolean>(false);
  otherUserTyping = signal<string | null>(null);
  connectionState = signal<'disconnected' | 'connecting' | 'connected'>('disconnected');

  private typingTimeout: any = null;

  initSignalR(orderId: string, userId: string, userRole: string): void {
    if (this.hubConnection) {
      this.disconnect();
    }

    this.connectionState.set('connecting');

    const hubUrl = `${this.baseUrl}/hubs/order-chat`;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveRealtimeMessage', (msg: ChatMessageDto) => {
      this.messages.update(prev => [...prev, msg]);
    });

    this.hubConnection.on('MessageMarkedAsRead', (payload: { messageId: string, readAt: string }) => {
      this.messages.update(prev => prev.map(m => m.id === payload.messageId ? { ...m, isRead: true, readAt: payload.readAt } : m));
    });

    this.hubConnection.on('UserTyping', (payload: { userId: string, isTyping: boolean }) => {
      if (payload.userId !== userId) {
        if (payload.isTyping) {
          this.otherUserTyping.set('Escribiendo...');
          if (this.typingTimeout) clearTimeout(this.typingTimeout);
          this.typingTimeout = setTimeout(() => this.otherUserTyping.set(null), 3000);
        } else {
          this.otherUserTyping.set(null);
        }
      }
    });

    this.hubConnection.on('PresenceUpdate', (payload: { userId: string, isOnline: boolean }) => {
      if (payload.userId !== userId) {
        this.isOtherUserOnline.set(payload.isOnline);
      }
    });

    this.hubConnection.start()
      .then(async () => {
        this.connectionState.set('connected');
        if (this.hubConnection) {
          await this.hubConnection.invoke('JoinOrderChat', orderId, userId, userRole);
        }
      })
      .catch(err => {
        console.warn('SignalR fallback o error conectando:', err);
        this.connectionState.set('disconnected');
      });
  }

  loadOrderMessages(orderId: string): void {
    this.http.get<ChatMessageDto[]>(`${this.baseUrl}/api/v1/orders/${orderId}/chat`).subscribe({
      next: (msgs) => this.messages.set(msgs),
      error: () => {}
    });
  }

  sendChatMessage(payload: SendMessageRequest): Observable<ChatMessageDto> {
    return this.http.post<ChatMessageDto>(`${this.baseUrl}/api/v1/orders/${payload.orderId}/chat`, payload);
  }

  uploadChatAttachment(file: File): Observable<{ url: string; fileName: string; format: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; fileName: string; format: string }>(`${this.baseUrl}/api/v1/products/upload-image`, formData);
  }

  sendTypingSignal(orderId: string, userId: string, isTyping: boolean): void {
    if (this.hubConnection && this.connectionState() === 'connected') {
      this.hubConnection.invoke('SendTypingIndicator', orderId, userId, isTyping).catch(() => {});
    }
  }

  markAsRead(messageId: string): void {
    this.http.post(`${this.baseUrl}/api/v1/orders/chat/${messageId}/read`, {}).subscribe({
      next: () => {
        if (this.hubConnection && this.connectionState() === 'connected') {
          this.hubConnection.invoke('NotifyMessageRead', messageId, new Date().toISOString()).catch(() => {});
        }
      },
      error: () => {}
    });
  }

  disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(() => {});
      this.hubConnection = null;
      this.connectionState.set('disconnected');
    }
  }
}
