import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface KeychainConfig {
  style: 'Pixel Art' | 'Flor en Resina' | 'Letra Inicial Glaseada';
  quantity: number;
  hardwareFinish: 'Dorado Vintage' | 'Plata Rodio' | 'Oro Rosa';
  includeTassel: boolean;
  engravedInitial: string;
}

@Component({
  selector: 'app-keychain-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-category-config-panel">
      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 1</span>
        <h3>Estilo de Llavero y Acabado Metálico</h3>

        <div class="fym-field-group">
          <label>Técnica Artesanal</label>
          <div class="fym-chips-grid">
            @for (st of styles; track st) {
              <button type="button" 
                      class="fym-chip-btn" 
                      [class.active]="config().style === st" 
                      (click)="updateStyle(st)">
                {{ st }}
              </button>
            }
          </div>
        </div>

        <div class="fym-field-group">
          <label>Herraje y Argolla Metálica</label>
          <div class="fym-hardware-options">
            @for (hw of hardwareOptions; track hw) {
              <button type="button" 
                      class="fym-hw-btn" 
                      [class.active]="config().hardwareFinish === hw" 
                      (click)="updateHardware(hw)">
                {{ hw }}
              </button>
            }
          </div>
        </div>

        <div class="fym-field-group">
          <label>Cantidad de Llaveros (Lotes o Parejas)</label>
          <div class="fym-stepper-box">
            <button type="button" (click)="decQty()">-</button>
            <span class="fym-qty-val">{{ config().quantity }} unidades</span>
            <button type="button" (click)="incQty()">+</button>
          </div>
        </div>
      </div>

      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 2</span>
        <h3>Detalles Personalizados</h3>

        <div class="fym-field-group">
          <label>Letra o Inicial Personalizada (Opcional)</label>
          <input type="text" maxlength="3" [ngModel]="config().engravedInitial" (ngModelChange)="updateInitial($event)" placeholder="Ej. M, A&M" />
        </div>

        <label class="fym-checkbox-card" [class.checked]="config().includeTassel">
          <input type="checkbox" [checked]="config().includeTassel" (change)="toggleTassel()" />
          <div class="fym-checkbox-label">
            <strong>Agregar Borla / Fleco de Hilo de Seda a Juego (+C$ 25.00 c/u)</strong>
            <span>Detalle textil suave con capuchón metálico</span>
          </div>
        </label>
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
    .fym-chips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .fym-chip-btn {
      padding: 10px; border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF8F9;
      border-radius: 12px; font-size: 0.82rem; font-weight: 700; color: #2A171D; cursor: pointer; transition: all 0.2s ease;
      &.active { background: #D9536F; color: #FFF; border-color: #D9536F; }
    }
    .fym-hardware-options { display: flex; gap: 8px; }
    .fym-hw-btn {
      flex: 1; padding: 10px; border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF;
      border-radius: 12px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
      &.active { background: #1A0D12; color: #FFF; border-color: #1A0D12; }
    }
    .fym-stepper-box {
      display: flex; align-items: center; justify-content: space-between; background: #FFF8F9; padding: 10px 16px; border-radius: 12px;
      button { width: 32px; height: 32px; border-radius: 50%; border: none; background: #D9536F; color: #FFF; font-weight: 800; cursor: pointer; }
      .fym-qty-val { font-weight: 800; color: #1A0D12; }
    }
    .fym-checkbox-card {
      display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px; border: 1px solid rgba(217, 83, 111, 0.2);
      border-radius: 14px; background: #FFF8F9; cursor: pointer; transition: all 0.2s ease;
      &.checked { border-color: #D9536F; background: #FDEEF1; }
      input { margin-top: 3px; accent-color: #D9536F; }
      .fym-checkbox-label {
        display: flex; flex-direction: column; gap: 2px;
        strong { font-size: 0.88rem; color: #1A0D12; }
        span { font-size: 0.78rem; color: #654E56; }
      }
    }
  `]
})
export class KeychainCustomizerComponent {
  config = input.required<KeychainConfig>();
  configChange = output<KeychainConfig>();

  styles: Array<'Pixel Art' | 'Flor en Resina' | 'Letra Inicial Glaseada'> = [
    'Pixel Art', 'Flor en Resina', 'Letra Inicial Glaseada'
  ];
  hardwareOptions: Array<'Dorado Vintage' | 'Plata Rodio' | 'Oro Rosa'> = [
    'Dorado Vintage', 'Plata Rodio', 'Oro Rosa'
  ];

  updateStyle(s: any) { this.configChange.emit({ ...this.config(), style: s }); }
  updateHardware(h: any) { this.configChange.emit({ ...this.config(), hardwareFinish: h }); }
  updateInitial(i: string) { this.configChange.emit({ ...this.config(), engravedInitial: i }); }
  toggleTassel() { this.configChange.emit({ ...this.config(), includeTassel: !this.config().includeTassel }); }
  incQty() { if (this.config().quantity < 50) this.configChange.emit({ ...this.config(), quantity: this.config().quantity + 1 }); }
  decQty() { if (this.config().quantity > 1) this.configChange.emit({ ...this.config(), quantity: this.config().quantity - 1 }); }
}
