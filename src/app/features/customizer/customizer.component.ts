import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, ProductExtra, CreateOrderRequest } from '../../core/models/catalog.models';
import { FYM_COLOR_SWATCHES, ColorSwatch, FYM_CATEGORIES } from '../../core/constants/app.constants';

import { ProductStage3dComponent } from './product-stage-3d.component';
import { BouquetCustomizerComponent, BouquetConfig } from './categories/bouquet-customizer.component';
import { PinataCustomizerComponent, PinataConfig } from './categories/pinata-customizer.component';
import { BoxCustomizerComponent, BoxConfig } from './categories/box-customizer.component';
import { KeychainCustomizerComponent, KeychainConfig } from './categories/keychain-customizer.component';
import { FrameCustomizerComponent, FrameConfig } from './categories/frame-customizer.component';
import { MuralCustomizerComponent, MuralConfig } from './categories/mural-customizer.component';

@Component({
  selector: 'app-customizer',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ProductStage3dComponent,
    BouquetCustomizerComponent,
    PinataCustomizerComponent,
    BoxCustomizerComponent,
    KeychainCustomizerComponent,
    FrameCustomizerComponent,
    MuralCustomizerComponent
  ],
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss']
})
export class CustomizerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  readonly auth = inject(AuthService);

  categorySlug = signal<string>(FYM_CATEGORIES.RAMOS);
  product = signal<Product | null>(null);
  extras = signal<ProductExtra[]>([]);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  orderSubmitted = signal<any | null>(null);

  availableColors: ColorSwatch[] = [...FYM_COLOR_SWATCHES];
  selectedColorHex = signal<string>(FYM_COLOR_SWATCHES[0].hex);
  selectedColorName = signal<string>(FYM_COLOR_SWATCHES[0].name);
  activeViewAngle = signal<'front' | 'angle' | 'top'>('front');

  // Estados reactivos por categoría específica
  bouquetConfig = signal<BouquetConfig>({
    material: 'Limpiapipas Premium',
    flowers: [
      { flowerType: 'Rosas Eternas', quantity: 6 },
      { flowerType: 'Girasoles', quantity: 2 }
    ],
    ribbonText: '',
    wrapColor: 'Rosa Peonía',
    includeCrown: false,
    includeButterflies: true,
    includePearls: false,
    includeLeds: true
  });

  pinataConfig = signal<PinataConfig>({
    size: 'Mediana',
    type: '3D Esculpida',
    birthdayName: '',
    wrappedStick: true,
    extraFigures: ''
  });

  boxConfig = signal<BoxConfig>({
    height: 25,
    width: 25,
    depth: 20,
    boxStyle: 'Explosiva Multicapa',
    includePhotos: true,
    photoCount: 12,
    includeLeds: true,
    includeChocolates: true,
    customDedication: ''
  });

  keychainConfig = signal<KeychainConfig>({
    style: 'Pixel Art',
    quantity: 2,
    hardwareFinish: 'Oro Rosa',
    includeTassel: true,
    engravedInitial: ''
  });

  frameConfig = signal<FrameConfig>({
    dimensions: '20x25 cm (Mediana)',
    withLeds: true,
    frameMaterial: 'Rosa Pastel Atelier',
    glassType: 'Vidrio Antirreflejo',
    botanicalElements: true,
    includePhotoPrint: true
  });

  muralConfig = signal<MuralConfig>({
    projectType: 'Maqueta Escolar Tridimensional',
    lengthCm: 60,
    widthCm: 40,
    complexityLevel: 'Detalle Avanzado',
    projectTopic: '',
    projectInstructions: ''
  });

  // Campos Comunes
  customTheme = signal<string>('');
  freeComments = signal<string>('');
  uploadedFileName = signal<string>('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'] || 'ramos';
      this.categorySlug.set(slug);
      this.loadCategoryData(slug);
    });
  }

  loadCategoryData(slug: string) {
    this.isLoading.set(true);
    this.apiService.getProducts().subscribe({
      next: (prods) => {
        const found = prods.find(p => p.categorySlug === slug) || prods[0] || null;
        this.product.set(found);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    this.apiService.getExtras().subscribe({
      next: (exts) => this.extras.set(exts),
      error: (err) => console.error(err)
    });
  }

  onColorSelected(swatch: ColorSwatch) {
    this.selectedColorHex.set(swatch.hex);
    this.selectedColorName.set(swatch.name);
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) this.uploadedFileName.set(file.name);
  }

  estimatedTotal = computed(() => {
    let total = this.product()?.basePrice || 350;
    const cat = this.categorySlug();

    if (cat === 'ramos') {
      const flowers = this.bouquetConfig().flowers.reduce((acc, f) => acc + f.quantity, 0);
      total = 280 + (flowers * 45);
      if (this.bouquetConfig().ribbonText) total += 60;
      if (this.bouquetConfig().includeCrown) total += 90;
      if (this.bouquetConfig().includeButterflies) total += 40;
      if (this.bouquetConfig().includePearls) total += 50;
      if (this.bouquetConfig().includeLeds) total += 70;
    } else if (cat === 'pinatas') {
      const cfg = this.pinataConfig();
      if (cfg.size === 'Grande') total += 300;
      if (cfg.size === 'Gigante') total += 600;
      if (cfg.type === '3D Esculpida') total += 200;
      if (cfg.wrappedStick) total += 50;
    } else if (cat === 'cajas') {
      const cfg = this.boxConfig();
      total = 400 + (cfg.height * cfg.width * cfg.depth / 1000) * 10;
      if (cfg.includePhotos) total += 80;
      if (cfg.includeLeds) total += 75;
      if (cfg.includeChocolates) total += 120;
    } else if (cat === 'llaveros') {
      total = this.keychainConfig().quantity * 95;
      if (this.keychainConfig().includeTassel) total += this.keychainConfig().quantity * 25;
    } else if (cat === 'retrateras') {
      total = 380;
      if (this.frameConfig().withLeds) total += 110;
      if (this.frameConfig().botanicalElements) total += 60;
      if (this.frameConfig().includePhotoPrint) total += 45;
    } else if (cat === 'maquetas') {
      total = 650;
      if (this.muralConfig().complexityLevel === 'Detalle Avanzado') total += 250;
      if (this.muralConfig().complexityLevel === 'Pieza de Exposición') total += 500;
    }

    return Math.round(total);
  });

  submitQuoteRequest() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const session = this.auth.currentUser();
    this.isSubmitting.set(true);

    const payloadConfig = {
      category: this.categorySlug(),
      paletteColor: this.selectedColorName(),
      paletteHex: this.selectedColorHex(),
      theme: this.customTheme(),
      comments: this.freeComments(),
      uploadedReference: this.uploadedFileName(),
      categorySpecific: this.getCategorySpecificPayload()
    };

    const orderRequest: CreateOrderRequest = {
      customerName: session?.fullName || 'Cliente Flor y Más',
      customerPhone: session?.phone || '+50588880000',
      deliveryAddress: session?.address || 'Por coordinar en chat',
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      deliveryTimeSlot: 'Tarde (1:00 PM - 5:00 PM)',
      deliveryFee: 0,
      items: [
        {
          productId: this.product()?.id,
          productName: `Personalización: ${this.product()?.name || this.categorySlug()}`,
          unitPrice: this.estimatedTotal(),
          quantity: 1,
          configurationJson: JSON.stringify(payloadConfig),
          extras: []
        }
      ]
    };

    this.apiService.submitCustomOrder(orderRequest).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        this.orderSubmitted.set(res);
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Error al enviar la solicitud.');
      }
    });
  }

  private getCategorySpecificPayload() {
    switch (this.categorySlug()) {
      case 'ramos': return this.bouquetConfig();
      case 'pinatas': return this.pinataConfig();
      case 'cajas': return this.boxConfig();
      case 'llaveros': return this.keychainConfig();
      case 'retrateras': return this.frameConfig();
      default: return this.muralConfig();
    }
  }
}
