import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-publisher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fym-product-builder-card">
      <div class="fym-card-header">
        <span class="fym-badge-pill fym-badge-custom">Catalogo & CDN</span>
        <h2>Publicar Producto con Variantes y WebP</h2>
        <p>Las imagenes se comprimen y convierten automaticamente a formato .webp en el CDN antes de ser publicadas.</p>
      </div>

      <div class="product-form-grid">
        <div class="form-column">
          <div class="form-field">
            <label>Nombre de la Pieza / Producto</label>
            <input type="text" [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="Ej. Ramo Eterno Realista Granate" />
          </div>

          <div class="form-field">
            <label>Categoria de Taller</label>
            <select [ngModel]="category()" (ngModelChange)="category.set($event)">
              <option value="ramos-eternos">Ramos Florales Eternos</option>
              <option value="pinatas-personalizadas">Piñatas Artesanales 3D</option>
              <option value="cuadros-y-marcos">Marcos y Cuadros Tematicos</option>
              <option value="cajas-explosivas">Cajas Sorpresa de Lujo</option>
              <option value="maquetas-y-murales">Maquetas y Murales</option>
            </select>
          </div>

          <div class="form-field">
            <label>Precio Base de Referencia (C$)</label>
            <input type="number" [ngModel]="basePrice()" (ngModelChange)="basePrice.set($event)" placeholder="Ej. 650" />
          </div>

          <div class="form-field">
            <label>Descripcion de Materiales y Tecnica</label>
            <textarea rows="3" [ngModel]="description()" (ngModelChange)="description.set($event)" placeholder="Detalla tecnicas de floristeria, saten, limpiapipas, etc..."></textarea>
          </div>
        </div>

        <div class="form-column">
          <div class="variants-section">
            <div class="variants-header">
              <label>Variantes de la Pieza (Precios especificos)</label>
              <button type="button" class="btn-add-var" (click)="addVariant()">+ Agregar Opcion</button>
            </div>

            @for (v of variants(); track $index) {
              <div class="variant-row">
                <input type="text" [(ngModel)]="v.name" placeholder="Nombre (ej. 12 Flores)" />
                <input type="text" [(ngModel)]="v.sku" placeholder="SKU" />
                <input type="number" [(ngModel)]="v.price" placeholder="Precio C$" />
                <button type="button" class="btn-remove-var" (click)="removeVariant($index)" [disabled]="variants().length === 1">X</button>
              </div>
            }
          </div>

          <div class="images-upload-section">
            <label>Fotografias del Producto (Conversion WebP)</label>
            <div class="upload-dropzone">
              <input type="file" multiple accept="image/*" (change)="onFilesSelected($event)" id="prodPhotosInput" hidden />
              <label for="prodPhotosInput" class="btn-select-photos">
                {{ isUploading() ? 'Convirtiendo y subiendo a CDN...' : 'Seleccionar Fotos del Taller' }}
              </label>
            </div>

            @if (uploadedImages().length > 0) {
              <div class="uploaded-thumbnails">
                @for (img of uploadedImages(); track img) {
                  <div class="thumb-card">
                    <img [src]="img" alt="Thumbnail WebP" />
                    <span class="webp-badge">WEBP CDN</span>
                  </div>
                }
              </div>
            }
          </div>

          <button type="button" class="btn-publish-product" (click)="submitPublish()" [disabled]="isSaving()">
            {{ isSaving() ? 'Guardando en catalogo...' : 'Guardar y Publicar en Catalogo' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fym-product-builder-card {
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #F1D4DB;
      padding: 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .fym-card-header {
      margin-bottom: 24px;
      h2 { font-size: 1.6rem; color: #1A0D12; margin: 8px 0 4px; font-weight: 700; }
      p { font-size: 0.9rem; color: #8C7A82; margin: 0; }
    }
    .product-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
      label { font-size: 0.82rem; font-weight: 700; color: #1A0D12; text-transform: uppercase; letter-spacing: 0.5px; }
      input, select, textarea {
        border: 1px solid #E5C3CC;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 0.92rem;
        outline: none;
        background: #FFF;
        transition: border-color 0.2s ease;
        &:focus { border-color: #D9536F; box-shadow: 0 0 0 3px rgba(217, 83, 111, 0.1); }
      }
    }
    .variants-section {
      background: #FFF8F9;
      border: 1px solid #F6DFE5;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 18px;
      .variants-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        label { font-weight: 700; font-size: 0.85rem; color: #1A0D12; }
        .btn-add-var {
          background: #FFF;
          border: 1px dashed #D9536F;
          color: #D9536F;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          &:hover { background: #D9536F; color: #FFF; }
        }
      }
      .variant-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        input {
          border: 1px solid #E5C3CC;
          border-radius: 8px;
          padding: 8px;
          font-size: 0.88rem;
          background: #FFF;
          flex: 1;
        }
        .btn-remove-var {
          background: #FEE2E2;
          color: #DC2626;
          border: none;
          border-radius: 8px;
          padding: 0 12px;
          font-weight: 700;
          cursor: pointer;
        }
      }
    }
    .images-upload-section {
      margin-bottom: 20px;
      label { display: block; font-weight: 700; font-size: 0.82rem; color: #1A0D12; text-transform: uppercase; margin-bottom: 8px; }
      .btn-select-photos {
        display: block;
        border: 2px dashed #E5C3CC;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        color: #8C7A82;
        font-weight: 600;
        cursor: pointer;
        background: #FAF8F8;
        transition: all 0.2s ease;
        &:hover { border-color: #D9536F; color: #D9536F; background: #FFF; }
      }
      .uploaded-thumbnails {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 12px;
        .thumb-card {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #F1D4DB;
          img { width: 100%; height: 100%; object-fit: cover; }
          .webp-badge {
            position: absolute;
            bottom: 2px;
            right: 2px;
            background: #D9536F;
            color: #FFF;
            font-size: 0.55rem;
            font-weight: 800;
            padding: 1px 4px;
            border-radius: 4px;
          }
        }
      }
    }
    .btn-publish-product {
      width: 100%;
      background: #D9536F;
      color: #FFF;
      border: none;
      padding: 14px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s ease;
      &:hover { background: #B33D55; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class ProductPublisherComponent {
  isUploading = input<boolean>(false);
  isSaving = input<boolean>(false);
  uploadedImages = input<string[]>([]);

  onUploadFiles = output<FileList>();
  onSave = output<{
    name: string;
    category: string;
    basePrice: number;
    description: string;
    variants: Array<{ name: string; sku: string; price: number }>;
  }>();

  name = signal<string>('');
  category = signal<string>('ramos-eternos');
  basePrice = signal<number>(0);
  description = signal<string>('');
  variants = signal<Array<{ name: string; sku: string; price: number }>>([
    { name: 'Estandar', sku: 'STD-01', price: 0 }
  ]);

  addVariant() {
    this.variants.update(vars => [...vars, { name: '', sku: '', price: 0 }]);
  }

  removeVariant(index: number) {
    this.variants.update(vars => vars.filter((_, i) => i !== index));
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.onUploadFiles.emit(files);
    }
  }

  submitPublish() {
    if (!this.name() || this.basePrice() <= 0) {
      alert('Por favor completa el nombre y precio base.');
      return;
    }

    this.onSave.emit({
      name: this.name(),
      category: this.category(),
      basePrice: this.basePrice(),
      description: this.description(),
      variants: this.variants()
    });
  }
}
