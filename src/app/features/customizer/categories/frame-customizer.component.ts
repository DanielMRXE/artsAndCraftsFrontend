import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FrameConfig {
  dimensions: '15x20 cm (Escritorio)' | '20x25 cm (Mediana)' | '30x40 cm (Mural Grande)';
  withLeds: boolean;
  frameMaterial: 'Madera Natural de Pino' | 'Acabado Blanco Nórdico' | 'Rosa Pastel Atelier';
  glassType: 'Vidrio Antirreflejo' | 'Acrílico Cristal de Seguridad';
  botanicalElements: boolean;
  includePhotoPrint: boolean;
}

@Component({
  selector: 'app-frame-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-category-config-panel">
      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 1</span>
        <h3>Dimensiones del Portarretratos & Material</h3>

        <div class="fym-field-group">
          <label>Tamaño de Marco</label>
          <div class="fym-sizes-list">
            @for (dm of dimensionsList; track dm) {
              <button type="button" 
                      class="fym-size-row-btn" 
                      [class.active]="config().dimensions === dm" 
                      (click)="updateDimensions(dm)">
                <span>{{ dm }}</span>
                <span class="fym-check-dot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </button>
            }
          </div>
        </div>

        <div class="fym-field-group">
          <label>Acabado del Marco</label>
          <div class="fym-chips-grid">
            @for (mat of materials; track mat) {
              <button type="button" 
                      class="fym-chip-btn" 
                      [class.active]="config().frameMaterial === mat" 
                      (click)="updateMaterial(mat)">
                {{ mat }}
              </button>
            }
          </div>
        </div>
      </div>

      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 2</span>
        <h3>Iluminación LED y Arreglo Botánico</h3>

        <div class="fym-checkbox-list">
          <label class="fym-checkbox-card" [class.checked]="config().withLeds">
            <input type="checkbox" [checked]="config().withLeds" (change)="toggleLeds()" />
            <div class="fym-checkbox-label">
              <strong>Iluminación Perimetral LED Cálida (+C$ 110.00)</strong>
              <span>Convierte el portarretratos en lámpara de noche decorativa con interruptor</span>
            </div>
          </label>

          <label class="fym-checkbox-card" [class.checked]="config().botanicalElements">
            <input type="checkbox" [checked]="config().botanicalElements" (change)="toggleBotanical()" />
            <div class="fym-checkbox-label">
              <strong>Flores Prensadas y Hojarasca Botánica Real (+C$ 60.00)</strong>
              <span>Composición floral preservada dentro del marco</span>
            </div>
          </label>

          <label class="fym-checkbox-card" [class.checked]="config().includePhotoPrint">
            <input type="checkbox" [checked]="config().includePhotoPrint" (change)="togglePhotoPrint()" />
            <div class="fym-checkbox-label">
              <strong>Impresión Fotográfica Profesional en Papel Perlado (+C$ 45.00)</strong>
              <span>Montaje listo para regalar con la imagen de referencia adjunta</span>
            </div>
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
    .fym-sizes-list { display: flex; flex-direction: column; gap: 8px; }
    .fym-size-row-btn {
      display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;
      border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF8F9; border-radius: 12px; font-weight: 700;
      font-size: 0.88rem; color: #1A0D12; cursor: pointer; transition: all 0.2s ease;
      .fym-check-dot { opacity: 0; color: #D9536F; font-weight: 900; }
      &.active { background: #FDEEF1; border-color: #D9536F; color: #D9536F; .fym-check-dot { opacity: 1; } }
    }
    .fym-chips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .fym-chip-btn {
      padding: 10px 8px; border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF8F9;
      border-radius: 12px; font-size: 0.82rem; font-weight: 700; color: #2A171D; cursor: pointer; transition: all 0.2s ease;
      &.active { background: #D9536F; color: #FFF; border-color: #D9536F; }
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
  `]
})
export class FrameCustomizerComponent {
  config = input.required<FrameConfig>();
  configChange = output<FrameConfig>();

  dimensionsList: Array<'15x20 cm (Escritorio)' | '20x25 cm (Mediana)' | '30x40 cm (Mural Grande)'> = [
    '15x20 cm (Escritorio)', '20x25 cm (Mediana)', '30x40 cm (Mural Grande)'
  ];
  materials: Array<'Madera Natural de Pino' | 'Acabado Blanco Nórdico' | 'Rosa Pastel Atelier'> = [
    'Madera Natural de Pino', 'Acabado Blanco Nórdico', 'Rosa Pastel Atelier'
  ];

  updateDimensions(d: any) { this.configChange.emit({ ...this.config(), dimensions: d }); }
  updateMaterial(m: any) { this.configChange.emit({ ...this.config(), frameMaterial: m }); }
  toggleLeds() { this.configChange.emit({ ...this.config(), withLeds: !this.config().withLeds }); }
  toggleBotanical() { this.configChange.emit({ ...this.config(), botanicalElements: !this.config().botanicalElements }); }
  togglePhotoPrint() { this.configChange.emit({ ...this.config(), includePhotoPrint: !this.config().includePhotoPrint }); }
}
