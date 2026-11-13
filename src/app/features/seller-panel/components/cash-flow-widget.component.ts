import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cash-flow-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-cash-grid">
      <aside class="fym-cash-form-card">
        <span class="fym-badge-pill fym-badge-custom">Registro Inmediato</span>
        <h3>Asentar Movimiento en Caja</h3>
        <p>Registra abonos de clientes, cobros de saldo contra entrega o egresos de compras de materiales.</p>

        <form (ngSubmit)="handleSubmit()" class="fym-cash-inputs">
          <div class="fym-segmented-control">
            <button type="button" [class.active]="movType() === 1" (click)="movType.set(1)">
              + Ingreso / Venta
            </button>
            <button type="button" [class.active]="movType() === 2" (click)="movType.set(2)">
              - Egreso / Gasto
            </button>
          </div>

          <div class="fym-field">
            <label>Monto en Córdobas (C$)</label>
            <input type="number" [ngModel]="movAmount()" (ngModelChange)="movAmount.set($event)" name="amount" placeholder="0.00" required />
          </div>

          <div class="fym-field">
            <label>Concepto / Detalle del Movimiento</label>
            <input type="text" [ngModel]="movDesc()" (ngModelChange)="movDesc.set($event)" name="desc" placeholder="Ej. Abono 50% Pedido #ORD-..." required />
          </div>

          <button type="submit" class="fym-btn-save-movement" [disabled]="movAmount() <= 0">
            Registrar en Caja &rarr;
          </button>
        </form>
      </aside>

      <section class="fym-cash-history-card">
        <h3>Historial de Movimientos</h3>
        <div class="fym-movements-stream">
          @for (m of movements(); track m.id) {
            <div class="fym-movement-item" [class.income]="m.type === 1" [class.expense]="m.type === 2">
              <div class="fym-mov-info">
                <strong>{{ m.description }}</strong>
                <span>{{ m.date | date:'short' }}</span>
              </div>
              <strong class="fym-mov-val">
                {{ m.type === 1 ? '+' : '-' }} C$ {{ m.amount | number:'1.2-2' }}
              </strong>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .fym-cash-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 1.5rem;
    }
    .fym-cash-form-card, .fym-cash-history-card {
      background: #FFFFFF;
      border: 1px solid #F1D4DB;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .fym-badge-pill {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    .fym-badge-custom {
      background: #FDF2F4;
      color: #D9536F;
      border: 1px solid #F1D4DB;
    }
    h3 {
      font-size: 1.25rem;
      color: #1A0D12;
      margin-bottom: 0.35rem;
    }
    p {
      font-size: 0.85rem;
      color: #6E535C;
      margin-bottom: 1.25rem;
    }
    .fym-segmented-control {
      display: flex;
      border: 1px solid #F1D4DB;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1rem;
      button {
        flex: 1;
        padding: 0.5rem;
        background: #FFF8F9;
        border: none;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        color: #6E535C;
        &.active {
          background: #D9536F;
          color: #FFFFFF;
        }
      }
    }
    .fym-field {
      margin-bottom: 1rem;
      label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        color: #1A0D12;
        margin-bottom: 0.3rem;
      }
      input {
        width: 100%;
        padding: 0.6rem 0.8rem;
        border: 1px solid #F1D4DB;
        border-radius: 6px;
        font-size: 0.9rem;
        box-sizing: border-box;
        &:focus {
          outline: none;
          border-color: #D9536F;
        }
      }
    }
    .fym-btn-save-movement {
      width: 100%;
      padding: 0.75rem;
      background: #1A0D12;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: background 0.2s;
      &:hover:not(:disabled) {
        background: #D9536F;
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .fym-movements-stream {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
      max-height: 480px;
      overflow-y: auto;
    }
    .fym-movement-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #FFF8F9;
      border: 1px solid #F1D4DB;
      border-radius: 8px;
      &.income .fym-mov-val {
        color: #2D6A4F;
      }
      &.expense .fym-mov-val {
        color: #C1121F;
      }
    }
    .fym-mov-info {
      display: flex;
      flex-direction: column;
      strong {
        font-size: 0.88rem;
        color: #1A0D12;
      }
      span {
        font-size: 0.75rem;
        color: #6E535C;
      }
    }
    .fym-mov-val {
      font-size: 0.95rem;
      font-weight: 700;
    }
    @media (max-width: 900px) {
      .fym-cash-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CashFlowWidgetComponent {
  movements = input.required<any[]>();
  addMovement = output<{ type: number; amount: number; description: string }>();

  movType = signal<number>(1);
  movAmount = signal<number>(0);
  movDesc = signal<string>('');

  handleSubmit(): void {
    if (this.movAmount() <= 0) return;
    this.addMovement.emit({
      type: this.movType(),
      amount: this.movAmount(),
      description: this.movDesc() || 'Registro operativo'
    });
    this.movAmount.set(0);
    this.movDesc.set('');
  }
}
