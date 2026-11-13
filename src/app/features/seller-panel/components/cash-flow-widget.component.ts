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
        <span class="fym-badge-pill fym-badge-custom">Registro Directo</span>
        <h3>Asentar Movimiento en Caja</h3>
        <p>Registra ingresos de abonos (50%), saldos de entrega o gastos de compra de insumos.</p>

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
            <label>Detalle / Concepto del Movimiento</label>
            <input type="text" [ngModel]="movDesc()" (ngModelChange)="movDesc.set($event)" name="desc" placeholder="Ej. Abono 50% Pedido #ORD-..." required />
          </div>

          <button type="submit" class="fym-btn-save-movement" [disabled]="movAmount() <= 0">
            Registrar Movimiento &rarr;
          </button>
        </form>
      </aside>

      <section class="fym-cash-history-card">
        <div class="history-card-header">
          <h3>Historial de Arqueo y Caja</h3>
          <span class="history-count">{{ movements().length }} movimientos registrados</span>
        </div>

        <div class="fym-movements-stream">
          @for (m of movements(); track m.id) {
            <div class="fym-movement-item" [class.income]="m.type === 1" [class.expense]="m.type === 2">
              <div class="fym-mov-info">
                <strong>{{ m.description }}</strong>
                <span>{{ m.date | date:'medium' }}</span>
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
      grid-template-columns: 380px 1fr;
      gap: 32px;
    }
    .fym-cash-form-card, .fym-cash-history-card {
      background: #FFFFFF;
      border: 1px solid rgba(217, 83, 111, 0.1);
      border-radius: 20px;
      padding: 28px 30px;
      box-shadow: 0 12px 32px -4px rgba(217, 83, 111, 0.06);
    }
    .history-card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #FDF2F4;
    }
    .history-count {
      font-size: 0.74rem;
      font-weight: 800;
      color: #957A84;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .fym-badge-pill {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 10px;
      border-radius: 9999px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .fym-badge-custom {
      background: #FDF2F4;
      color: #D9536F;
      border: 1px solid rgba(217, 83, 111, 0.2);
    }
    h3 {
      font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #2A171D;
      letter-spacing: -0.02em;
      margin: 0 0 6px;
    }
    p {
      font-size: 0.85rem;
      color: #654E56;
      line-height: 1.4;
      margin-bottom: 24px;
    }
    .fym-segmented-control {
      display: flex;
      background: #FFF8F9;
      border: 1px solid rgba(217, 83, 111, 0.14);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 18px;
      button {
        flex: 1;
        padding: 9px;
        background: transparent;
        border: none;
        border-radius: 9px;
        font-size: 0.82rem;
        font-weight: 800;
        cursor: pointer;
        color: #654E56;
        transition: all 0.2s;
        &.active {
          background: #2A171D;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(42, 23, 29, 0.15);
        }
      }
    }
    .fym-field {
      margin-bottom: 18px;
      label {
        display: block;
        font-size: 0.74rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #2A171D;
        margin-bottom: 6px;
      }
      input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid rgba(217, 83, 111, 0.16);
        border-radius: 10px;
        font-size: 0.92rem;
        font-weight: 600;
        background: #FFFFFF;
        box-sizing: border-box;
        transition: all 0.2s;
        &:focus {
          outline: none;
          border-color: #D9536F;
          box-shadow: 0 0 0 3px rgba(217, 83, 111, 0.1);
        }
      }
    }
    .fym-btn-save-movement {
      width: 100%;
      padding: 12px;
      background: #D9536F;
      color: #FFFFFF;
      border: none;
      border-radius: 10px;
      font-weight: 800;
      font-size: 0.88rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(217, 83, 111, 0.25);
      transition: all 0.2s;
      &:hover:not(:disabled) {
        background: #B93753;
        transform: translateY(-1px);
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .fym-movements-stream {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 480px;
      overflow-y: auto;
    }
    .fym-movement-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: #FFF8F9;
      border: 1px solid rgba(217, 83, 111, 0.1);
      border-radius: 12px;
      transition: all 0.2s;
      &:hover {
        background: #FFFFFF;
        box-shadow: 0 4px 14px rgba(217, 83, 111, 0.08);
      }
      &.income .fym-mov-val {
        color: #4D7058;
      }
      &.expense .fym-mov-val {
        color: #D9536F;
      }
    }
    .fym-mov-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      strong {
        font-size: 0.92rem;
        color: #2A171D;
        font-weight: 700;
      }
      span {
        font-size: 0.74rem;
        color: #957A84;
        font-weight: 600;
      }
    }
    .fym-mov-val {
      font-family: 'Syne', monospace;
      font-size: 1.05rem;
      font-weight: 800;
    }
    @media (max-width: 960px) {
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
