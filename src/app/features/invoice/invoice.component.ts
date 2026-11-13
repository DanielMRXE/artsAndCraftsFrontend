import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  order = signal<any | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.apiService.getOrderById(orderId).subscribe({
        next: (data) => {
          this.order.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.apiService.getOrders().subscribe({
        next: (orders) => {
          if (orders.length > 0) {
            this.order.set(orders[0]);
          }
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  printInvoice(): void {
    window.print();
  }
}
