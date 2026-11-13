import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorSwatch } from '../../core/constants/app.constants';

@Component({
  selector: 'app-product-stage-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fym-stage-pedestal-wrap" [style.background]="pedestalBackground()">
      
      <!-- Insignia Flotante Superior -->
      <div class="fym-stage-badge-bar">
        <span class="fym-pill-live">Artesanía En Vivo</span>
        <span class="fym-category-tag">{{ categoryName() }}</span>
      </div>

      <!-- Pedestal Central con Rotación y Física de Resorte -->
      <div class="fym-stage-viewport">
        <div class="fym-sculpture-halo" [style.borderColor]="selectedColorHex()"></div>
        
        <div class="fym-artifact-core" [style.transform]="activeTransform()">
          @if (categorySlug() === 'ramos') {
            <div class="fym-sculpture-vector bouquet">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <circle cx="12" cy="8" r="4"></circle>
                <circle cx="7" cy="11" r="3.5"></circle>
                <circle cx="17" cy="11" r="3.5"></circle>
                <path d="M12 12v9"></path>
                <path d="M9 16c2 1 4 1 6 0"></path>
                <path d="M8 21l4-5 4 5"></path>
              </svg>
            </div>
          } @else if (categorySlug() === 'pinatas') {
            <div class="fym-sculpture-vector pinata">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2"></polygon>
              </svg>
            </div>
          } @else if (categorySlug() === 'cajas') {
            <div class="fym-sculpture-vector box">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <path d="m3.3 7 8.7 5 8.7-5"></path>
                <path d="M12 22V12"></path>
              </svg>
            </div>
          } @else if (categorySlug() === 'llaveros') {
            <div class="fym-sculpture-vector keychain">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <circle cx="8" cy="8" r="6"></circle>
                <path d="M12.5 12.5L21 21"></path>
                <path d="M18 15l2 2"></path>
                <path d="M15 18l2 2"></path>
              </svg>
            </div>
          } @else if (categorySlug() === 'retrateras') {
            <div class="fym-sculpture-vector frame">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M20.4 14.5L16 10 4 20"></path>
              </svg>
            </div>
          } @else {
            <div class="fym-sculpture-vector mural">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
              </svg>
            </div>
          }
        </div>

        <!-- Sombra Proyectada Multicapa en el Suelo -->
        <div class="fym-stage-ground-shadow" [style.background]="shadowStyle()"></div>
      </div>

      <!-- Controles de Perspectiva Táctil -->
      <div class="fym-view-angles-bar">
        <button type="button" [class.active]="activeAngle() === 'front'" (click)="setAngle('front')">
          Frontal
        </button>
        <button type="button" [class.active]="activeAngle() === 'angle'" (click)="setAngle('angle')">
          Perspectiva 3D
        </button>
        <button type="button" [class.active]="activeAngle() === 'top'" (click)="setAngle('top')">
          Vista Superior
        </button>
      </div>

      <!-- Barra de Swatches de Color -->
      <div class="fym-swatches-selector">
        <div class="fym-swatches-title">
          <span>Acabado / Color:</span>
          <strong>{{ selectedColorName() }}</strong>
        </div>
        <div class="fym-swatches-row">
          @for (sw of swatches(); track sw.hex) {
            <button type="button" 
                    class="fym-swatch-ball" 
                    [style.background]="sw.hex"
                    [class.active]="selectedColorHex() === sw.hex"
                    (click)="colorSelect.emit(sw)"
                    [title]="sw.name">
            </button>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    .fym-stage-pedestal-wrap {
      border-radius: 28px;
      border: 1px solid rgba(217, 83, 111, 0.15);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      position: sticky;
      top: 100px;
      box-shadow: 0 25px 60px -15px rgba(217, 83, 111, 0.18);
      overflow: hidden;
    }
    .fym-stage-badge-bar {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      .fym-pill-live {
        font-size: 0.72rem; font-weight: 800; background: #D9536F; color: #FFF;
        padding: 3px 12px; border-radius: 9999px; text-transform: uppercase;
      }
      .fym-category-tag { font-size: 0.82rem; font-weight: 700; color: #654E56; }
    }
    .fym-stage-viewport {
      width: 260px;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .fym-sculpture-halo {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      border: 2px dashed;
      opacity: 0.4;
      animation: fym-spin 25s linear infinite;
    }
    .fym-artifact-core {
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      filter: drop-shadow(0 15px 25px rgba(42, 23, 29, 0.2));
      cursor: grab;
      user-select: none;
      z-index: 2;
    }
    .fym-sculpture-vector {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D9536F;
      svg { transition: transform 0.3s ease; }
    }
    .fym-stage-ground-shadow {
      position: absolute;
      bottom: 20px;
      width: 170px;
      height: 24px;
      border-radius: 50%;
      filter: blur(8px);
      z-index: 1;
      transition: all 0.3s ease;
    }
    .fym-view-angles-bar {
      display: flex;
      gap: 6px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      padding: 4px;
      border-radius: 9999px;
      border: 1px solid rgba(217, 83, 111, 0.15);
      button {
        padding: 6px 14px;
        border: none;
        background: transparent;
        font-size: 0.76rem;
        font-weight: 700;
        color: #654E56;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s ease;
        &.active {
          background: #D9536F;
          color: #FFF;
          box-shadow: 0 2px 8px rgba(217, 83, 111, 0.25);
        }
      }
    }
    .fym-swatches-selector {
      width: 100%;
      background: rgba(255, 255, 255, 0.75);
      padding: 14px 18px;
      border-radius: 18px;
      border: 1px solid rgba(217, 83, 111, 0.12);
      .fym-swatches-title {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;
        color: #2A171D;
        margin-bottom: 10px;
        strong { color: #D9536F; }
      }
      .fym-swatches-row {
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;
      }
      .fym-swatch-ball {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #FFF;
        box-shadow: 0 2px 6px rgba(42, 23, 29, 0.15);
        cursor: pointer;
        transition: transform 0.2s ease, border-color 0.2s ease;
        &.active {
          transform: scale(1.22);
          border-color: #1A0D12;
        }
      }
    }
    @keyframes fym-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductStage3dComponent {
  categorySlug = input.required<string>();
  categoryName = input.required<string>();
  selectedColorHex = input.required<string>();
  selectedColorName = input.required<string>();
  swatches = input.required<ColorSwatch[]>();

  colorSelect = output<ColorSwatch>();

  activeAngle = input<'front' | 'angle' | 'top'>('front');
  angleChange = output<'front' | 'angle' | 'top'>();

  setAngle(a: 'front' | 'angle' | 'top') {
    this.angleChange.emit(a);
  }

  pedestalBackground(): string {
    return `radial-gradient(circle at 50% 30%, ${this.selectedColorHex()}18 0%, #FFFFFF 75%)`;
  }

  shadowStyle(): string {
    return `radial-gradient(ellipse at center, rgba(42, 23, 29, 0.35) 0%, rgba(217, 83, 111, 0.12) 60%, transparent 80%)`;
  }

  activeTransform(): string {
    switch (this.activeAngle()) {
      case 'angle': return 'perspective(600px) rotateY(-18deg) rotateX(10deg) scale(1.06)';
      case 'top': return 'perspective(600px) rotateX(25deg) scale(0.96)';
      default: return 'perspective(600px) rotateY(0deg) scale(1)';
    }
  }
}
