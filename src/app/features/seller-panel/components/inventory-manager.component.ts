import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fym-inventory-card">
      <div class="fym-card-header">
        <div>
          <span class="fym-badge-pill fym-badge-custom">Control de Materia Prima</span>
          <h3>Insumos & Stock de Taller</h3>
          <p>Monitoreo continuo de limpiapipas, satén, opalinas y resmas para confección inmediata.</p>
        </div>
        <span class="stock-total-badge">{{ materials().length }} insumos inventariados</span>
      </div>

      <div class="fym-inventory-grid">
        @for (mat of materials(); track mat.id) {
          <div class="fym-material-card" [class.alert]="mat.isLowStock">
            <div class="mat-card-top">
              <h4>{{ mat.name }}</h4>
              @if (mat.isLowStock) {
                <span class="stock-badge-alert">Bajo Mínimo</span>
              } @else {
                <span class="stock-badge-ok">Abastecido</span>
              }
            </div>
            <div class="fym-stock-info">
              <span class="stock-num">{{ mat.currentStock }} {{ mat.unitMeasure }}</span>
              <span class="stock-min">Mínimo sugerido: {{ mat.minimumAlertStock }} {{ mat.unitMeasure }}</span>
            </div>
            @if (mat.isLowStock) {
              <div class="fym-alert-strip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Reponer en almacén antes del siguiente pedido</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .fym-inventory-card {
      background: #FFFFFF;
      border: 1px solid rgba(217, 83, 111, 0.1);
      border-radius: 20px;
      padding: 32px 34px;
      box-shadow: 0 12px 32px -4px rgba(217, 83, 111, 0.06);
    }
    .fym-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      padding-bottom: 18px;
      border-bottom: 1px solid #FDF2F4;
      gap: 16px;
      h3 {
        font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
        font-size: 1.45rem;
        font-weight: 800;
        color: #2A171D;
        letter-spacing: -0.02em;
        margin: 4px 0 6px;
      }
      p {
        font-size: 0.88rem;
        color: #654E56;
        margin: 0;
      }
    }
    .stock-total-badge {
      font-size: 0.74rem;
      font-weight: 800;
      color: #957A84;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      flex-shrink: 0;
    }
    .fym-badge-pill {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 10px;
      border-radius: 9999px;
      display: inline-block;
    }
    .fym-badge-custom {
      background: #FDF2F4;
      color: #D9536F;
      border: 1px solid rgba(217, 83, 111, 0.2);
    }
    .fym-inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 20px;
    }
    .fym-material-card {
      background: #FFF8F9;
      border: 1px solid rgba(217, 83, 111, 0.1);
      border-radius: 14px;
      padding: 20px 22px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.22s;
      &:hover {
        background: #FFFFFF;
        box-shadow: 0 8px 24px rgba(217, 83, 111, 0.08);
        border-color: rgba(217, 83, 111, 0.3);
      }
      &.alert {
        border-color: rgba(217, 83, 111, 0.4);
        background: #FFF5F7;
      }
    }
    .mat-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      h4 {
        font-size: 0.98rem;
        color: #2A171D;
        font-weight: 800;
        margin: 0;
        line-height: 1.3;
      }
    }
    .stock-badge-alert {
      font-size: 0.68rem;
      font-weight: 800;
      color: #D9536F;
      background: #FDF2F4;
      border: 1px solid rgba(217, 83, 111, 0.25);
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .stock-badge-ok {
      font-size: 0.68rem;
      font-weight: 800;
      color: #4D7058;
      background: #EEF5F0;
      border: 1px solid rgba(77, 112, 88, 0.25);
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .fym-stock-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .stock-num {
      font-family: 'Syne', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #2A171D;
    }
    .stock-min {
      font-size: 0.78rem;
      color: #957A84;
      font-weight: 600;
    }
    .fym-alert-strip {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.76rem;
      color: #D9536F;
      font-weight: 700;
      padding-top: 4px;
      border-top: 1px solid rgba(217, 83, 111, 0.1);
      .alert-svg {
        width: 15px;
        height: 15px;
        flex-shrink: 0;
      }
    }
  `]
})
export class InventoryManagerComponent {
  materials = input.required<any[]>();
}
