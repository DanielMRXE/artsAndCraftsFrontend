import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessageDto, SendMessageRequest } from '../../core/services/order-chat.service';

@Component({
  selector: 'app-negotiation-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './negotiation-chat.component.html',
  styleUrls: ['./negotiation-chat.component.scss']
})
export class NegotiationChatComponent {
  orderId = input.required<string>();
  orderCode = input.required<string>();
  targetUserName = input<string>('Taller Flor y Más');
  currentUserRole = input<'Client' | 'Artisan' | 'Admin'>('Client');
  isOnline = input<boolean>(false);
  typingStatus = input<string | null>(null);
  messages = input<ChatMessageDto[]>([]);

  onSendMessage = output<SendMessageRequest>();
  onSendAttachment = output<File>();
  onAcceptOffer = output<ChatMessageDto>();
  onTyping = output<boolean>();

  inputText = signal<string>('');

  onTextChange(text: string) {
    this.inputText.set(text);
    this.onTyping.emit(text.length > 0);
  }

  submitText() {
    const txt = this.inputText().trim();
    if (!txt) return;

    this.onSendMessage.emit({
      orderId: this.orderId(),
      senderId: 'current-user',
      senderName: this.currentUserRole() === 'Client' ? 'Cliente' : 'Taller Artesanal',
      senderRole: this.currentUserRole(),
      contentType: 'Text',
      text: txt
    });

    this.inputText.set('');
    this.onTyping.emit(false);
  }

  handleFileSelect(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.onSendAttachment.emit(file);
    }
  }
}
