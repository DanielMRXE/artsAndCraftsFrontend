import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BoxConfig {
  height: number;
  width: number;
  depth: number;
  boxStyle: 'Explosiva Multicapa' | 'Cofre Tapa Deslizable' | 'Hexagonal Sorpresa';
  includePhotos: boolean;
  photoCount: number;
  includeLeds: boolean;
  includeChocolates: boolean;
  customDedication: string;
}

@Component({
  selector: 'app-box-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-category-config-panel">
      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 1</span>
        <h3>Dimensiones y Estilo de Caja</h3>

        <div class="fym-field-group">
          <label>Estilo de Mecanismo de Apertura</label>
          <div class="fym-style-chips">
            @for (st of styles; track st) {
              <button type="button" 
                      class="fym-chip-btn" 
                      [class.active]="config().boxStyle === st" 
                      (click)="updateStyle(st)">
                {{ st }}
              </button>
            }
          </div>
        </div>

        <div class="fym-sliders-grid">
          <div class="fym-slider-control">
            <div class="fym-slider-header">
              <span>Alto</span>
              <strong>{{ config().height }} cm</strong>
            </div>
            <input type="range" min="15" max="40" [ngModel]="config().height" (ngModelChange)="updateHeight($event)" />
          </div>

          <div class="fym-slider-control">
            <div class="fym-slider-header">
              <span>Ancho</span>
              <strong>{{ config().width }} cm</strong>
            </div>
            <input type="range" min="15" max="40" [ngModel]="config().width" (ngModelChange)="updateWidth($event)" />
          </div>

          <div class="fym-slider-control">
            <div class="fym-slider-header">
              <span>Profundidad</span>
              <strong>{{ config().depth }} cm</strong>
            </div>
            <input type="range" min="10" max="30" [ngModel]="config().depth" (ngModelChange)="updateDepth($event)" />
          </div>
        </div>
      </div>

      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 2</span>
        <h3>Elementos Sorpresa y Decoración Interior</h3>

        <div class="fym-checkbox-list">
          <label class="fym-checkbox-card" [class.checked]="config().includePhotos">
            <input type="checkbox" [checked]="config().includePhotos" (change)="togglePhotos()" />
            <div class="fym-checkbox-label">
              <strong>Fotografías Personales Reveladas (+C$ 80.00)</strong>
              <span>Montadas en cascada o compartimentos interiores</span>
            </div>
          </label>

          @if (config().includePhotos) {
            <div class="fym-conditional-indent">
              <label>Cantidad de Fotos a Incluir</label>
              <div class="fym-photo-stepper">
                <button type="button" (click)="decPhotos()">-</button>
                <span>{{ config().photoCount }} fotografías</span>
                <button type="button" (click)="incPhotos()">+</button>
              </div>
            </div>
          }

          <label class="fym-checkbox-card" [class.checked]="config().includeLeds">
            <input type="checkbox" [checked]="config().includeLeds" (change)="toggleLeds()" />
            <div class="fym-checkbox-label">
              <strong>Guirnalda de Luces LED Micro-Hada (+C$ 75.00)</strong>
              <span>Luz cálida con batería oculta e interruptor decorativo</span>
            </div>
          </label>

          <label class="fym-checkbox-card" [class.checked]="config().includeChocolates">
            <input type="checkbox" [checked]="config().includeChocolates" (change)="toggleChocolates()" />
            <div class="fym-checkbox-label">
              <strong>Surtido de Chocolates Finos (+C$ 120.00)</strong>
              <span>Ferrero Rocher y bombones en base satinada</span>
            </div>
          </label>
        </div>

        <div class="fym-field-group" style="margin-top: 16px;">
          <label>Dedicatoria Central de la Caja</label>
          <input type="text" [ngModel]="config().customDedication" (ngModelChange)="updateDedication($event)" placeholder="Ej. Feliz Aniversario, Mi Amor" />
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
    .fym-field-group { display: flex; flex-direction: column; gap: 8px; }
    label { font-size: 0.85rem; font-weight: 700; color: #2A171D; }
    input[type="text"] {
      padding: 12px 14px; border: 1px solid rgba(42, 23, 29, 0.12); border-radius: 12px; font-size: 0.92rem;
      background: #FAFAFA; &:focus { outline: none; border-color: #D9536F; background: #FFF; box-shadow: 0 0 0 3px rgba(217, 83, 111, 0.12); }
    }
    .fym-style-chips {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
      @media (max-width: 500px) { grid-template-columns: 1fr; }
    }
    .fym-chip-btn {
      padding: 10px 8px; border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF8F9;
      border-radius: 12px; font-size: 0.82rem; font-weight: 700; color: #2A171D; cursor: pointer; transition: all 0.2s ease;
      &.active { background: #D9536F; color: #FFF; border-color: #D9536F; }
    }
    .fym-sliders-grid { display: flex; flex-direction: column; gap: 14px; margin-top: 16px; }
    .fym-slider-control {
      background: #FFF8F9; padding: 12px 16px; border-radius: 14px;
      .fym-slider-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; }
      input[type="range"] { width: 100%; accent-color: #D9536F; }
    }
    .fym-checkbox-list { display: flex; flex-direction: column; gap: 10px; }
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
    .fym-conditional-indent {
      padding: 10px 16px; margin-left: 24px; background: #FFF; border: 1px dashed rgba(217, 83, 111, 0.3); border-radius: 12px;
      display: flex; align-items: center; justify-content: space-between;
      .fym-photo-stepper {
        display: flex; align-items: center; gap: 10px;
        button { width: 28px; height: 28px; border-radius: 50%; border: none; background: #D9536F; color: #FFF; font-weight: bold; cursor: pointer; }
      }
    }
  `]
})
export class BoxCustomizerComponent {
  config = input.required<BoxConfig>();
  configChange = output<BoxConfig>();

  styles: Array<'Explosiva Multicapa' | 'Cofre Tapa Deslizable' | 'Hexagonal Sorpresa'> = [
    'Explosiva Multicapa', 'Cofre Tapa Deslizable', 'Hexagonal Sorpresa'
  ];

  updateStyle(s: any) { this.configChange.emit({ ...this.config(), boxStyle: s }); }
  updateHeight(h: number) { this.configChange.emit({ ...this.config(), height: Number(h) }); }
  updateWidth(w: number) { this.configChange.emit({ ...this.config(), width: Number(w) }); }
  updateDepth(d: number) { this.configChange.emit({ ...this.config(), depth: Number(d) }); }
  togglePhotos() { this.configChange.emit({ ...this.config(), includePhotos: !this.config().includePhotos }); }
  toggleLeds() { this.configChange.emit({ ...this.config(), includeLeds: !this.config().includeLeds }); }
  toggleChocolates() { this.configChange.emit({ ...this.config(), includeChocolates: !this.config().includeChocolates }); }
  updateDedication(t: string) { this.configChange.emit({ ...this.config(), customDedication: t }); }
  incPhotos() { if (this.config().photoCount < 24) this.configChange.emit({ ...this.config(), photoCount: this.config().photoCount + 2 }); }
  decPhotos() { if (this.config().photoCount > 4) this.configChange.emit({ ...this.config(), photoCount: this.config().photoCount - 2 }); }
}
