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
        <span class="fym-badge-pill fym-badge-custom">Catálogo & CDN WebP</span>
        <h2>Publicar Nueva Pieza Artesanal</h2>
        <p>Las imágenes se procesan y optimizan automáticamente en formato .webp en el CDN antes de su publicación en el escaparate.</p>
      </div>

      <div class="product-form-grid">
        <!-- Columna 1: Datos Base -->
        <div class="form-column">
          <div class="form-field">
            <label>Nombre de la Pieza / Creación</label>
            <input type="text" [ngModel]="name()" (ngModelChange)="name.set($event)" placeholder="Ej. Ramo Eterno Realista Granate" />
          </div>

          <div class="form-field">
            <label>Categoría del Atelier</label>
            <div class="select-wrapper">
              <select [ngModel]="category()" (ngModelChange)="category.set($event)">
                <option value="ramos-eternos">Ramos Florales Eternos</option>
                <option value="pinatas-personalizadas">Piñatas Artesanales 3D</option>
                <option value="cuadros-y-marcos">Marcos y Cuadros Temáticos</option>
                <option value="cajas-explosivas">Cajas Sorpresa de Lujo</option>
                <option value="maquetas-y-murales">Maquetas y Murales</option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label>Precio Base de Referencia (C$)</label>
            <input type="number" [ngModel]="basePrice()" (ngModelChange)="basePrice.set($event)" placeholder="Ej. 650" />
          </div>

          <div class="form-field">
            <label>Técnica y Materiales Empleados</label>
            <textarea rows="4" [ngModel]="description()" (ngModelChange)="description.set($event)" placeholder="Detalla tipo de floristería, satén, limpiapipas, texturas y dimensiones..."></textarea>
          </div>
        </div>

        <!-- Columna 2: Variantes y Fotografías -->
        <div class="form-column">
          <div class="variants-section">
            <div class="variants-header">
              <div>
                <label>Opciones y Variantes de la Pieza</label>
                <span class="sub-hint">Precios específicos por tamaño o número de elementos</span>
              </div>
              <button type="button" class="btn-add-var" (click)="addVariant()">+ Agregar Opción</button>
            </div>

            <div class="variants-stack">
              @for (v of variants(); track $index) {
                <div class="variant-row">
                  <input type="text" [(ngModel)]="v.name" placeholder="Ej. Ramo 12 Flores" />
                  <input type="text" [(ngModel)]="v.sku" placeholder="SKU" class="sku-input" />
                  <input type="number" [(ngModel)]="v.price" placeholder="C$" class="price-input" />
                  <button type="button" class="btn-remove-var" (click)="removeVariant($index)" [disabled]="variants().length === 1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="images-upload-section">
            <label>Galería Fotográfica (Optimización WebP)</label>
            <div class="upload-dropzone">
              <input type="file" multiple accept="image/*" (change)="onFilesSelected($event)" id="prodPhotos" hidden />
              <label for="prodPhotos" class="btn-select-photos">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>{{ isUploading() ? 'Procesando a WebP...' : 'Seleccionar fotos de alta resolución' }}</span>
              </label>
            </div>

            @if (uploadedImages().length > 0) {
              <div class="uploaded-thumbnails">
                @for (imgUrl of uploadedImages(); track imgUrl) {
                  <div class="thumb-card">
                    <img [src]="imgUrl" alt="Thumbnail WebP" />
                    <span class="webp-badge">WEBP CDN</span>
                  </div>
                }
              </div>
            }
          </div>

          <button type="button" class="btn-publish-product" (click)="submitPublish()" [disabled]="isSaving()">
            {{ isSaving() ? 'Guardando en escaparate...' : 'Publicar Producto en Catálogo &rarr;' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-publisher.component.scss']
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
    { name: 'Estándar', sku: 'STD-01', price: 0 }
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
