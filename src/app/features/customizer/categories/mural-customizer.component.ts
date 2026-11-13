import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MuralConfig {
  projectType: 'Maqueta Escolar Tridimensional' | 'Mural Escenográfico Decorativo' | 'Diorama Temático';
  widthCm: number;
  lengthCm: number;
  complexityLevel: 'Estándar' | 'Detalle Avanzado' | 'Pieza de Exposición';
  projectTopic: string;
  projectInstructions: string;
}

@Component({
  selector: 'app-mural-customizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-category-config-panel">
      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 1</span>
        <h3>Modalidad de Proyecto & Escala</h3>

        <div class="fym-field-group">
          <label>Tipo de Composición</label>
          <div class="fym-chips-grid">
            @for (pt of types; track pt) {
              <button type="button" 
                      class="fym-chip-btn" 
                      [class.active]="config().projectType === pt" 
                      (click)="updateType(pt)">
                {{ pt }}
              </button>
            }
          </div>
        </div>

        <div class="fym-sliders-row">
          <div class="fym-slider-box">
            <div class="fym-slider-header">
              <span>Largo / Ancho Base</span>
              <strong>{{ config().lengthCm }} cm</strong>
            </div>
            <input type="range" min="30" max="150" [ngModel]="config().lengthCm" (ngModelChange)="updateLength($event)" />
          </div>

          <div class="fym-slider-box">
            <div class="fym-slider-header">
              <span>Altura / Profundidad</span>
              <strong>{{ config().widthCm }} cm</strong>
            </div>
            <input type="range" min="20" max="100" [ngModel]="config().widthCm" (ngModelChange)="updateWidth($event)" />
          </div>
        </div>
      </div>

      <div class="fym-step-card">
        <span class="fym-step-badge">Paso 2</span>
        <h3>Temática & Nivel de Detalle del Taller</h3>

        <div class="fym-field-group">
          <label>Nivel de Complejidad & Acabado</label>
          <div class="fym-segmented-control">
            @for (lvl of levels; track lvl) {
              <button type="button" 
                      [class.active]="config().complexityLevel === lvl" 
                      (click)="updateLevel(lvl)">
                {{ lvl }}
              </button>
            }
          </div>
        </div>

        <div class="fym-field-group">
          <label>Tema del Proyecto o Asignatura</label>
          <input type="text" [ngModel]="config().projectTopic" (ngModelChange)="updateTopic($event)" placeholder="Ej. Sistema Solar a Escala, Volcán Masaya con Erupción, Mural Arrecife" />
        </div>

        <div class="fym-field-group">
          <label>Instrucciones y Puntos Específicos a Evaluar</label>
          <textarea rows="3" [ngModel]="config().projectInstructions" (ngModelChange)="updateInstructions($event)" placeholder="Indica si debe llevar piezas móviles, etiquetas explicativas, materiales específicos o rúbrica escolar..."></textarea>
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
    input[type="text"], textarea {
      padding: 12px 14px; border: 1px solid rgba(42, 23, 29, 0.12); border-radius: 12px; font-size: 0.92rem;
      background: #FAFAFA; &:focus { outline: none; border-color: #D9536F; background: #FFF; box-shadow: 0 0 0 3px rgba(217, 83, 111, 0.12); }
    }
    .fym-chips-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
    .fym-chip-btn {
      padding: 10px 14px; border: 1px solid rgba(217, 83, 111, 0.2); background: #FFF8F9;
      border-radius: 12px; font-size: 0.84rem; font-weight: 700; color: #2A171D; cursor: pointer; text-align: left;
      transition: all 0.2s ease;
      &.active { background: #D9536F; color: #FFF; border-color: #D9536F; }
    }
    .fym-sliders-row { display: flex; flex-direction: column; gap: 12px; }
    .fym-slider-box {
      background: #FFF8F9; padding: 12px 16px; border-radius: 14px;
      .fym-slider-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; }
      input[type="range"] { width: 100%; accent-color: #D9536F; }
    }
    .fym-segmented-control {
      display: flex; gap: 8px; background: #FDEEF1; padding: 4px; border-radius: 14px;
      button {
        flex: 1; padding: 10px 8px; border: none; background: transparent; font-size: 0.82rem;
        font-weight: 700; color: #654E56; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
        &.active { background: #FFFFFF; color: #D9536F; box-shadow: 0 2px 8px rgba(217, 83, 111, 0.15); }
      }
    }
  `]
})
export class MuralCustomizerComponent {
  config = input.required<MuralConfig>();
  configChange = output<MuralConfig>();

  types: Array<'Maqueta Escolar Tridimensional' | 'Mural Escenográfico Decorativo' | 'Diorama Temático'> = [
    'Maqueta Escolar Tridimensional', 'Mural Escenográfico Decorativo', 'Diorama Temático'
  ];
  levels: Array<'Estándar' | 'Detalle Avanzado' | 'Pieza de Exposición'> = [
    'Estándar', 'Detalle Avanzado', 'Pieza de Exposición'
  ];

  updateType(t: any) { this.configChange.emit({ ...this.config(), projectType: t }); }
  updateLength(l: number) { this.configChange.emit({ ...this.config(), lengthCm: Number(l) }); }
  updateWidth(w: number) { this.configChange.emit({ ...this.config(), widthCm: Number(w) }); }
  updateLevel(lvl: any) { this.configChange.emit({ ...this.config(), complexityLevel: lvl }); }
  updateTopic(tp: string) { this.configChange.emit({ ...this.config(), projectTopic: tp }); }
  updateInstructions(ins: string) { this.configChange.emit({ ...this.config(), projectInstructions: ins }); }
}
