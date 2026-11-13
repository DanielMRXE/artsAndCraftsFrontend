import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fym-inventory-card">
      <div class="fym-card-header">
        <span class="fym-badge-pill fym-badge-custom">Stock de Insumos</span>
        <h3>Inventario de Materia Prima en Taller</h3>
        <p>Monitoreo continuo de limpiapipas, satén, opalinas y resmas para confección inmediata.</p>
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
      border: 1px solid #F1D4DB;
      border-radius: 12px;
      padding: 1.75rem;
    }
    .fym-card-header {
      margin-bottom: 1.5rem;
      h3 {
        font-size: 1.25rem;
        color: #1A0D12;
        margin: 0.35rem 0 0.25rem;
      }
      p {
        font-size: 0.85rem;
        color: #6E535C;
      }
    }
    .fym-badge-pill {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      display: inline-block;
    }
    .fym-badge-custom {
      background: #FDF2F4;
      color: #D9536F;
      border: 1px solid #F1D4DB;
    }
    .fym-inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .fym-material-card {
      background: #FFF8F9;
      border: 1px solid #F1D4DB;
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      &.alert {
        border-color: #E63946;
        background: #FFF5F5;
      }
    }
    .mat-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
      h4 {
        font-size: 0.95rem;
        color: #1A0D12;
        font-weight: 700;
        margin: 0;
      }
    }
    .stock-badge-alert {
      font-size: 0.7rem;
      font-weight: 700;
      color: #C1121F;
      background: #FDE8E8;
      border: 1px solid #F8B4B4;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .stock-badge-ok {
      font-size: 0.7rem;
      font-weight: 700;
      color: #2D6A4F;
      background: #E8F5E9;
      border: 1px solid #C8E6C9;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .fym-stock-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .stock-num {
      font-size: 1.15rem;
      font-weight: 800;
      color: #1A0D12;
    }
    .stock-min {
      font-size: 0.75rem;
      color: #6E535C;
    }
    .fym-alert-strip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #C1121F;
      font-weight: 600;
      .alert-svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }
    }
  `]
})
export class InventoryManagerComponent {
  materials = input.required<any[]>();
}
