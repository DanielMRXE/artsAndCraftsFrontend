import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Category, Product } from '../../core/models/catalog.models';

export interface StageProduct {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  priceEstimate: string;
  tagline: string;
  backgroundTheme: string;
  accentColor: string;
  badge: 'Disponible' | 'Por Encargo';
  craftTime: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  activeFilter = signal<'all' | 'available' | 'custom'>('all');
  selectedCategory = signal<string>('all');
  isLoading = signal<boolean>(true);

  // 6 Categorías Completas en el Slider 3D
  stageProducts: StageProduct[] = [
    {
      id: 'ramos-eternos',
      name: 'Ramos Florales Eternos',
      category: 'Flores Artesanales',
      categorySlug: 'ramos',
      priceEstimate: 'C$ 650.00',
      tagline: 'Flores eternas combinables confeccionadas a mano en limpiapipas aterciopelado o satén con cinta personalizada.',
      backgroundTheme: 'radial-gradient(circle at 50% 35%, #FDE4EB 0%, #FFF8F9 70%)',
      accentColor: '#D9536F',
      badge: 'Por Encargo',
      craftTime: '2 a 3 días'
    },
    {
      id: 'pinatas-3d',
      name: 'Piñatas Esculpidas 3D',
      category: 'Piñatas & Fiestas',
      categorySlug: 'pinatas',
      priceEstimate: 'C$ 950.00',
      tagline: 'Estructuras tridimensionales con relieve hiperdetallado, temática libre y palo decorado a juego.',
      backgroundTheme: 'radial-gradient(circle at 50% 35%, #FEEAF0 0%, #FFF8F9 70%)',
      accentColor: '#E85B7A',
      badge: 'Por Encargo',
      craftTime: '3 a 4 días'
    },
    {
      id: 'cajas-sorpresa',
      name: 'Cajas Explosivas & Regalos',
      category: 'Cajas de Regalo',
      categorySlug: 'cajas',
      priceEstimate: 'C$ 580.00',
      tagline: 'Mecanismos desplegables multicapa con compartimentos para fotos reveladas, luces LED cálidas y chocolates.',
      backgroundTheme: 'radial-gradient(circle at 50% 35%, #FCE2E9 0%, #FFF8F9 70%)',
      accentColor: '#C94663',
      badge: 'Por Encargo',
      craftTime: '24 a 48 horas'
    },
    {
      id: 'llaveros-pixel',
      name: 'Llaveros Pixel Art & Resina',
      category: 'Accesorios & Detalles',
      categorySlug: 'llaveros',
      priceEstimate: 'C$ 120.00',
      tagline: 'Llaveros artesanales en pixel art, flores en resina cristal o iniciales glaseadas con herrajes dorados o rodio.',
      backgroundTheme: 'radial-gradient(circle at 50% 35%, #FDE8ED 0%, #FFF8F9 70%)',
      accentColor: '#B93753',
      badge: 'Disponible',
      craftTime: 'Stock Inmediato'
    },
    {
      id: 'retrateras-iluminadas',
      name: 'Portarretratos & Retrateras',
      category: 'Decoración & Recuerdos',
      categorySlug: 'retrateras',
      priceEstimate: 'C$ 420.00',
      tagline: 'Marcos de madera noble con iluminación LED cálida perimetral, flores prensadas y acabado botánico.',
      backgroundTheme: 'radial-gradient(circle at 50% 35%, #FDEEF1 0%, #FFF8F9 70%)',
      accentColor: '#D9536F',
      badge: 'Por Encargo',
      craftTime: '24 a 48 horas'
    },
    {
      id: 'maquetas-murales',
      name: 'Maquetas & Murales Decorativos',
      category: 'Proyectos Escolares & Decoración',
      categorySlug: 'maquetas',
      priceEstimate: 'C$ 650.00',
      tagline: 'Proyectos tridimensionales a escala, dioramas escolares y murales temáticos con alto nivel de realismo.',
      backgroundTheme: 'radial-gradient(circle at 50% 35%, #F7E7EC 0%, #FFF8F9 70%)',
      accentColor: '#9C2740',
      badge: 'Por Encargo',
      craftTime: '3 a 5 días'
    }
  ];

  activeStageIndex = signal<number>(0);
  currentStageProduct = computed(() => this.stageProducts[this.activeStageIndex()]);

  ngOnInit(): void {
    this.apiService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error(err)
    });

    this.apiService.getProducts().subscribe({
      next: (prods) => {
        this.featuredProducts.set(prods);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  nextSlide() {
    this.activeStageIndex.update(idx => (idx + 1) % this.stageProducts.length);
  }

  prevSlide() {
    this.activeStageIndex.update(idx => (idx - 1 + this.stageProducts.length) % this.stageProducts.length);
  }

  setSlide(index: number) {
    this.activeStageIndex.set(index);
  }

  setFilter(filter: 'all' | 'available' | 'custom') {
    this.activeFilter.set(filter);
  }

  setCategory(catSlug: string) {
    this.selectedCategory.set(catSlug);
  }

  filteredProducts = computed(() => {
    let prods = this.featuredProducts();
    const filter = this.activeFilter();
    const cat = this.selectedCategory();

    if (filter === 'available') {
      prods = prods.filter(p => p.commercialType === 'Available');
    } else if (filter === 'custom') {
      prods = prods.filter(p => p.commercialType === 'CustomMade');
    }

    if (cat !== 'all') {
      prods = prods.filter(p => p.categorySlug === cat);
    }

    return prods;
  });
}
