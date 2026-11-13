import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PinataConfig {
  size: 'Chica' | 'Mediana' | 'Grande' | 'Gigante';
  type: '2D' | '3D Esculpida';
  birthdayName: string;
  wrappedStick: boolean;
  extraFigures: string;
}

@Component({
  selector: 'app-pinata-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-category-config-panel">
      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 1</span>
        <h3>Estructura y Dimensiones de la Piñata</h3>

        <div class="fym-field-group">
          <label>Formato de Construcción</label>
          <div class="fym-segmented-control">
            <button type="button" [class.active]="config().type === '3D Esculpida'" (click)="updateType('3D Esculpida')">
              3D Esculpida (Volumen Real)
            </button>
            <button type="button" [class.active]="config().type === '2D'" (click)="updateType('2D')">
              2D Silueta Plana
            </button>
          </div>
        </div>

        <div class="fym-field-group">
          <label>Tamaño de Piñata</label>
          <div class="fym-size-grid">
            @for (sz of sizes; track sz) {
              <button type="button" 
                      class="fym-size-pill" 
                      [class.active]="config().size === sz" 
                      (click)="updateSize(sz)">
                {{ sz }}
              </button>
            }
          </div>
        </div>
      </div>

      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 2</span>
        <h3>Personalización Festiva</h3>

        <div class="fym-field-group">
          <label>Nombre del Cumpleañero o Festejado</label>
          <input type="text" [ngModel]="config().birthdayName" (ngModelChange)="updateName($event)" placeholder="Ej. Mateo (6 años)" />
        </div>

        <div class="fym-field-group">
          <label>Figuras Adicionales o Detalles en Fomi</label>
          <input type="text" [ngModel]="config().extraFigures" (ngModelChange)="updateFigures($event)" placeholder="Ej. Escudo, número en relieve, estrellas" />
        </div>

        <label class="fym-checkbox-card" [class.checked]="config().wrappedStick">
          <input type="checkbox" [checked]="config().wrappedStick" (change)="toggleStick()" />
          <div class="fym-checkbox-label">
            <strong>Incluir Palo Temático Forrado Artesanalmente</strong>
            <span>Combinado a juego con los colores y temática de la piñata (+C$ 50.00)</span>
          </div>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .fym-category-config-panel { display: flex; flex-direction: column; gap: 20px; }
    .fym-step-card {
      background: #FFFFFF;
      border: 1px solid rgba(217, 83, 111, 0.12);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(42, 23, 29, 0.03);
    }
    .fym-step-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      color: #D9536F;
      background: #FDEEF1;
      padding: 2px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    h3 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; color: #1A0D12; margin: 0 0 16px; }
    .fym-field-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    label { font-size: 0.85rem; font-weight: 700; color: #2A171D; }
    input[type="text"] {
      padding: 12px 14px;
      border: 1px solid rgba(42, 23, 29, 0.12);
      border-radius: 12px;
      font-size: 0.92rem;
      background: #FAFAFA;
      &:focus { outline: none; border-color: #D9536F; background: #FFF; box-shadow: 0 0 0 3px rgba(217, 83, 111, 0.12); }
    }
    .fym-segmented-control {
      display: flex; gap: 8px; background: #FDEEF1; padding: 4px; border-radius: 14px;
      button {
        flex: 1; padding: 10px 12px; border: none; background: transparent; font-size: 0.84rem;
        font-weight: 700; color: #654E56; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
        &.active { background: #FFFFFF; color: #D9536F; box-shadow: 0 2px 8px rgba(217, 83, 111, 0.15); }
      }
    }
    .fym-size-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
      @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
    }
    .fym-size-pill {
      padding: 12px 8px; border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF8F9;
      border-radius: 12px; font-weight: 700; color: #2A171D; font-size: 0.88rem; cursor: pointer;
      transition: all 0.2s ease;
      &.active { background: #D9536F; color: #FFF; border-color: #D9536F; }
    }
    .fym-checkbox-card {
      display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border: 1px solid rgba(217, 83, 111, 0.2);
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
export class PinataCustomizerComponent {
  config = input.required<PinataConfig>();
  configChange = output<PinataConfig>();

  sizes: Array<'Chica' | 'Mediana' | 'Grande' | 'Gigante'> = ['Chica', 'Mediana', 'Grande', 'Gigante'];

  updateType(t: '2D' | '3D Esculpida') {
    this.configChange.emit({ ...this.config(), type: t });
  }

  updateSize(s: 'Chica' | 'Mediana' | 'Grande' | 'Gigante') {
    this.configChange.emit({ ...this.config(), size: s });
  }

  updateName(name: string) {
    this.configChange.emit({ ...this.config(), birthdayName: name });
  }

  updateFigures(figs: string) {
    this.configChange.emit({ ...this.config(), extraFigures: figs });
  }

  toggleStick() {
    this.configChange.emit({ ...this.config(), wrappedStick: !this.config().wrappedStick });
  }
}
