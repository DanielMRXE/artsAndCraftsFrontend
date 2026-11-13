import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FlowerRow {
  flowerType: string;
  quantity: number;
}

export interface BouquetConfig {
  material: 'Limpiapipas Premium' | 'Listón Satén';
  flowers: FlowerRow[];
  ribbonText: string;
  wrapColor: string;
  includeCrown: boolean;
  includeButterflies: boolean;
  includePearls: boolean;
  includeLeds: boolean;
}

@Component({
  selector: 'app-bouquet-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-category-config-panel">
      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 1</span>
        <h3>Material & Variedad Floral Combinable</h3>

        <div class="fym-field-group">
          <label>Material Base de Flores Eternas</label>
          <div class="fym-segmented-control">
            <button type="button" [class.active]="config().material === 'Limpiapipas Premium'" (click)="updateMaterial('Limpiapipas Premium')">
              Limpiapipas Aterciopelado
            </button>
            <button type="button" [class.active]="config().material === 'Listón Satén'" (click)="updateMaterial('Listón Satén')">
              Listón de Satén Brillante
            </button>
          </div>
        </div>

        <div class="fym-field-group">
          <label>Flores en el Ramo (Combinación Libre)</label>
          <div class="fym-flowers-table">
            @for (f of config().flowers; track f.flowerType; let i = $index) {
              <div class="fym-flower-row">
                <span class="fym-flower-name">{{ f.flowerType }}</span>
                <div class="fym-stepper">
                  <button type="button" (click)="decFlower(i)">-</button>
                  <span class="fym-qty">{{ f.quantity }}</span>
                  <button type="button" (click)="incFlower(i)">+</button>
                  <button type="button" class="fym-del-btn" (click)="removeFlower(i)" title="Eliminar flor">&times;</button>
                </div>
              </div>
            }
          </div>

          <div class="fym-add-flower-bar">
            <input type="text" [(ngModel)]="newFlower" placeholder="Ej. Lirios, Margaritas, Lavanda..." (keyup.enter)="addFlower()" />
            <button type="button" (click)="addFlower()">+ Agregar Variedad</button>
          </div>
        </div>
      </div>

      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 2</span>
        <h3>Cinta Personalizada y Accesorios</h3>

        <div class="fym-field-group">
          <label>Cinta con Dedicatoria Impresa</label>
          <input type="text" [ngModel]="config().ribbonText" (ngModelChange)="updateRibbon($event)" placeholder="Ej. Para la mujer de mi vida • Siempre juntos" />
        </div>

        <div class="fym-checkbox-grid">
          <label class="fym-check-chip" [class.active]="config().includeButterflies">
            <input type="checkbox" [checked]="config().includeButterflies" (change)="toggleButterflies()" />
            <span>Mariposas Monarca 3D (+C$ 40)</span>
          </label>
          <label class="fym-check-chip" [class.active]="config().includeCrown">
            <input type="checkbox" [checked]="config().includeCrown" (change)="toggleCrown()" />
            <span>Corona Miniatura Imperial (+C$ 90)</span>
          </label>
          <label class="fym-check-chip" [class.active]="config().includePearls">
            <input type="checkbox" [checked]="config().includePearls" (change)="togglePearls()" />
            <span>Perlas en Centro Floral (+C$ 50)</span>
          </label>
          <label class="fym-check-chip" [class.active]="config().includeLeds">
            <input type="checkbox" [checked]="config().includeLeds" (change)="toggleLeds()" />
            <span>Luces LED Hada (+C$ 70)</span>
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fym-category-config-panel { display: flex; flex-direction: column; gap: 20px; }
    .fym-step-card {
      background: #FFFFFF; border: 1px solid rgba(217, 83, 111, 0.12);
      border-radius: 20px; padding: 24px; box-shadow: 0 4px 16px rgba(42, 23, 29, 0.03);
    }
    .fym-step-badge {
      display: inline-block; font-size: 0.72rem; font-weight: 800; color: #D9536F;
      background: #FDEEF1; padding: 2px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px;
    }
    h3 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; color: #1A0D12; margin: 0 0 16px; }
    .fym-field-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
    label { font-size: 0.85rem; font-weight: 700; color: #2A171D; }
    input[type="text"] {
      padding: 12px 14px; border: 1px solid rgba(42, 23, 29, 0.12); border-radius: 12px; font-size: 0.92rem;
      background: #FAFAFA; &:focus { outline: none; border-color: #D9536F; background: #FFF; box-shadow: 0 0 0 3px rgba(217, 83, 111, 0.12); }
    }
    .fym-segmented-control {
      display: flex; gap: 8px; background: #FDEEF1; padding: 4px; border-radius: 14px;
      button {
        flex: 1; padding: 10px 12px; border: none; background: transparent; font-size: 0.84rem;
        font-weight: 700; color: #654E56; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
        &.active { background: #FFFFFF; color: #D9536F; box-shadow: 0 2px 8px rgba(217, 83, 111, 0.15); }
      }
    }
    .fym-flowers-table { display: flex; flex-direction: column; gap: 8px; }
    .fym-flower-row {
      display: flex; justify-content: space-between; align-items: center; padding: 10px 14px;
      background: #FFF8F9; border-radius: 12px; border: 1px solid rgba(217, 83, 111, 0.12);
      .fym-flower-name { font-weight: 700; font-size: 0.9rem; color: #1A0D12; }
      .fym-stepper {
        display: flex; align-items: center; gap: 8px;
        button { width: 28px; height: 28px; border-radius: 50%; border: none; background: #FDEEF1; color: #D9536F; font-weight: 800; cursor: pointer; }
        .fym-del-btn { background: #FFF1F2; color: #BE123C; }
        .fym-qty { font-weight: 800; font-size: 0.95rem; min-width: 22px; text-align: center; }
      }
    }
    .fym-add-flower-bar {
      display: flex; gap: 8px; margin-top: 8px;
      input { flex: 1; }
      button { padding: 0 16px; background: #D9536F; color: #FFF; border: none; border-radius: 12px; font-weight: 700; font-size: 0.84rem; cursor: pointer; }
    }
    .fym-checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .fym-check-chip {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; border: 1px solid rgba(217, 83, 111, 0.2);
      background: #FFF8F9; border-radius: 12px; cursor: pointer; font-size: 0.82rem; font-weight: 700; color: #2A171D;
      input { display: none; }
      &.active { background: #D9536F; color: #FFF; border-color: #D9536F; }
    }
  `]
})
export class BouquetCustomizerComponent {
  config = input.required<BouquetConfig>();
  configChange = output<BouquetConfig>();
  newFlower = '';

  updateMaterial(m: any) { this.configChange.emit({ ...this.config(), material: m }); }
  updateRibbon(t: string) { this.configChange.emit({ ...this.config(), ribbonText: t }); }
  toggleButterflies() { this.configChange.emit({ ...this.config(), includeButterflies: !this.config().includeButterflies }); }
  toggleCrown() { this.configChange.emit({ ...this.config(), includeCrown: !this.config().includeCrown }); }
  togglePearls() { this.configChange.emit({ ...this.config(), includePearls: !this.config().includePearls }); }
  toggleLeds() { this.configChange.emit({ ...this.config(), includeLeds: !this.config().includeLeds }); }

  addFlower() {
    const val = this.newFlower.trim();
    if (val) {
      const list = [...this.config().flowers, { flowerType: val, quantity: 1 }];
      this.configChange.emit({ ...this.config(), flowers: list });
      this.newFlower = '';
    }
  }

  removeFlower(index: number) {
    const list = this.config().flowers.filter((_, i) => i !== index);
    this.configChange.emit({ ...this.config(), flowers: list });
  }

  incFlower(index: number) {
    const list = this.config().flowers.map((f, i) => i === index ? { ...f, quantity: f.quantity + 1 } : f);
    this.configChange.emit({ ...this.config(), flowers: list });
  }

  decFlower(index: number) {
    const list = this.config().flowers.map((f, i) => i === index && f.quantity > 1 ? { ...f, quantity: f.quantity - 1 } : f);
    this.configChange.emit({ ...this.config(), flowers: list });
  }
}
