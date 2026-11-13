import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { FYM_API_ENDPOINTS, FYM_COUNTRIES, FYM_ASSETS, CountryInfo } from '../../core/constants/app.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly assets = FYM_ASSETS;

  countries: CountryInfo[] = FYM_COUNTRIES;
  selectedCountry = signal<CountryInfo>(FYM_COUNTRIES[0]); // Nicaragua (+505) por defecto

  // Estado del flujo
  isRegisterMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Campos del formulario
  phoneNumber = signal<string>('');
  password = signal<string>('');
  firstName = signal<string>('');
  lastName = signal<string>('');
  fullName = computed(() => `${this.firstName().trim()} ${this.lastName().trim()}`.trim());
  address = signal<string>('');

  fullPhoneNumber = computed(() => {
    const raw = this.phoneNumber().replace(/\D/g, '');
    return `${this.selectedCountry().dialCode}${raw}`;
  });

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.redirectPostAuth();
    }
  }

  switchMode(register: boolean): void {
    this.isRegisterMode.set(register);
    this.errorMessage.set('');
  }

  onCountryChange(countryCode: string): void {
    const found = this.countries.find(c => c.code === countryCode);
    if (found) {
      this.selectedCountry.set(found);
    }
  }

  submitAuth(): void {
    this.errorMessage.set('');
    const rawDigits = this.phoneNumber().replace(/\D/g, '');

    if (!rawDigits || rawDigits.length < 7) {
      this.errorMessage.set(`Ingresa un número de teléfono válido para ${this.selectedCountry().name}.`);
      return;
    }

    if (!this.password() || this.password().length < 4) {
      this.errorMessage.set('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (this.isRegisterMode()) {
      if (!this.firstName().trim() || !this.lastName().trim()) {
        this.errorMessage.set('Por favor ingresa tu nombre y apellido.');
        return;
      }
    }

    this.isLoading.set(true);

    if (this.isRegisterMode()) {
      // Registro de nuevo usuario
      this.http.post<any>(`${FYM_API_ENDPOINTS.BASE_URL}/auth/register`, {
        phone: this.fullPhoneNumber(),
        fullName: this.fullName().trim(),
        password: this.password(),
        address: this.address().trim() || 'Nicaragua'
      }).subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'No se pudo completar el registro.');
        }
      });
    } else {
      // Login con teléfono y contraseña
      this.http.post<any>(`${FYM_API_ENDPOINTS.BASE_URL}${FYM_API_ENDPOINTS.AUTH_LOGIN}`, {
        phone: this.fullPhoneNumber(),
        password: this.password()
      }).subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Número o contraseña incorrectos.');
        }
      });
    }
  }

  private handleSuccess(res: any): void {
    this.isLoading.set(false);
    const avatar = this.auth.generateDefaultAvatar(res.fullName);
    this.auth.setSession({
      token: res.token,
      fullName: res.fullName,
      email: res.email,
      phone: res.phone || this.fullPhoneNumber(),
      address: this.address().trim(),
      avatarUrl: avatar,
      role: res.role,
      userId: res.userId
    });
    this.redirectPostAuth();
  }

  private redirectPostAuth(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || (this.auth.isSellerOrAdmin() ? '/panel-taller' : '/pedidos');
    this.router.navigateByUrl(returnUrl);
  }
}
