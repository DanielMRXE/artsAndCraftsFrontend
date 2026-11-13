/**
 * FLOR Y MÁS - CONSTANTES GLOBALES DE LA APLICACIÓN
 * Clean Code: Single Source of Truth para Colores, Slugs, Rutas y Configuración
 */

import { environment } from '../../../environments/environment';

export const FYM_PALETTE = {
  // Paleta Rosa & Blush
  CANVAS: '#FFF8F9',
  SURFACE: '#FDEEF1',
  SURFACE_CARD: '#FFFFFF',
  ROSE_PRIMARY: '#D9536F',
  ROSE_DARK: '#B93753',
  ROSE_LIGHT: '#FDE8EC',
  ROSE_SOFT: '#F4A7B5',
  ROSE_ACCENT: '#E85B7A',

  // Contrastes de Tinta
  INK_CACAO: '#2A171D',
  INK_DEEP: '#1A0D12',
  INK_SECONDARY: '#654E56',
  INK_MUTED: '#957A84',
  INK_LIGHT: '#C6B3BA',

  // Acentos Botánicos
  SAGE: '#4D7058',
  SAGE_DEEP: '#2F4C37',
  SAGE_LIGHT: '#EEF5F0',
  HONEY: '#C48E44',
  HONEY_LIGHT: '#FBF4E8',
  WHITE: '#FFFFFF'
} as const;

export interface ColorSwatch {
  name: string;
  hex: string;
}

export const FYM_COLOR_SWATCHES: ColorSwatch[] = [
  { name: 'Rosa Peonía', hex: FYM_PALETTE.ROSE_PRIMARY },
  { name: 'Rosa Pastel', hex: FYM_PALETTE.ROSE_SOFT },
  { name: 'Rosa Fresa', hex: FYM_PALETTE.ROSE_ACCENT },
  { name: 'Blush Suave', hex: FYM_PALETTE.SURFACE },
  { name: 'Grosella Oscuro', hex: FYM_PALETTE.INK_CACAO },
  { name: 'Verde Salvia', hex: FYM_PALETTE.SAGE },
  { name: 'Blanco Puro', hex: FYM_PALETTE.WHITE }
];

export const FYM_CATEGORIES = {
  RAMOS: 'ramos',
  PINATAS: 'pinatas',
  CAJAS: 'cajas',
  LLAVEROS: 'llaveros',
  RETRATERAS: 'retrateras',
  DISPONIBLES: 'disponibles'
} as const;

export const FYM_ORDER_STATUS = {
  PENDING: 0,
  QUOTED: 1,
  CONFIRMED_DEPOSIT: 2,
  IN_PRODUCTION: 3,
  READY_TO_DELIVER: 4,
  DELIVERED: 5,
  CANCELLED: 6
} as const;

export interface CountryInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  length: number;
}

export const FYM_COUNTRIES: CountryInfo[] = [
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: 'NI', placeholder: '8888 7777', length: 8 },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: 'CR', placeholder: '8888 8888', length: 8 },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: 'HN', placeholder: '9888 7777', length: 8 },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: 'SV', placeholder: '7888 7777', length: 8 },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: 'GT', placeholder: '5888 7777', length: 8 },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: 'PA', placeholder: '6888 7777', length: 8 },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: 'US', placeholder: '555 000 0000', length: 10 },
  { code: 'ES', name: 'España', dialCode: '+34', flag: 'ES', placeholder: '612 34 56 78', length: 9 },
  { code: 'MX', name: 'México', dialCode: '+52', flag: 'MX', placeholder: '55 1234 5678', length: 10 },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: 'CO', placeholder: '300 123 4567', length: 10 }
];

export const FYM_API_ENDPOINTS = {
  BASE_URL: environment.apiUrl,
  HUB_URL: environment.hubUrl,
  CDN_URL: environment.cdnUrl,
  AUTH_LOGIN: '/auth/login',
  CATALOG_CATEGORIES: '/catalog/categories',
  CATALOG_PRODUCTS: '/catalog/products',
  CATALOG_EXTRAS: '/catalog/extras',
  ORDERS: '/orders',
  ORDERS_CUSTOM: '/orders/custom-request',
  CASHFLOW_SUMMARY: '/cashflow/summary',
  CASHFLOW_MOVEMENTS: '/cashflow/movements',
  INVENTORY_MATERIALS: '/inventory/materials'
} as const;

/**
 * RUTAS GLOBALES DE RECURSOS E IMÁGENES (Single Source of Truth)
 * Permite cambiar los logos, banners y avatares del navbar, login, y dashboard
 * simplemente actualizando la ruta aquí o asignando la URL deseada.
 */
export const FYM_ASSETS = {
  // Logos de Marca
  BRAND_LOGO: '', // Si está vacío, se renderiza el SVG vectorial del diseño
  BRAND_FAVICON: 'favicon.ico',

  // Imágenes del Flujo de Autenticación / Login
  AUTH_COVER_IMAGE: '', // Imagen de fondo o ilustración lateral del login
  AUTH_BADGE_ICON: '', // Icono / Logo principal del encabezado del login

  // Dashboard / Taller
  DASHBOARD_BANNER: '', // Banner superior del taller o panel del vendedor
  DEFAULT_AVATAR: 'assets/images/default-avatar.png',

  // Categorías de Productos (Imágenes de Respaldo)
  PRODUCTS_PLACEHOLDER: 'assets/images/placeholder-craft.png'
} as const;

/**
 * INFORMACIÓN DE CONTACTO GLOBAL DEL NEGOCIO (Single Source of Truth)
 * Centraliza la dirección física, teléfonos de WhatsApp, email de soporte y redes
 * para consumirlas directamente en footers, headers, enlaces directos y comprobantes.
 */
export const FYM_CONTACT_INFO = {
  BUSINESS_NAME: 'Flor y Más',
  TAGLINE: 'Atelier de arte efímero, flores eternas, piñatas 3D y sorpresas personalizadas.',
  COUNTRY: 'Nicaragua',
  CITY: 'Managua',
  ADDRESS_LINE: 'Managua, Nicaragua • Envíos a todo el país',
  PHONE_DISPLAY: '+505 8888 7777',
  PHONE_RAW: '50588887777',
  WHATSAPP_LINK: 'https://wa.me/50588887777',
  EMAIL: 'taller@florymas.com',
  SCHEDULE: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
  INSTAGRAM_HANDLE: '@florymas.ni',
  INSTAGRAM_URL: 'https://instagram.com/florymas.ni',
  FACEBOOK_URL: 'https://facebook.com/florymas.ni'
} as const;
