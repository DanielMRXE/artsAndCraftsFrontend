import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface UserSession {
  token: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl: string;
  role: 'Admin' | 'Seller' | 'Customer';
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly sessionSignal = signal<UserSession | null>(this.getInitialSession());

  readonly session = computed(() => this.sessionSignal());
  readonly isAuthenticated = computed(() => !!this.sessionSignal());
  readonly currentUser = computed(() => this.sessionSignal());
  readonly role = computed(() => this.sessionSignal()?.role || null);
  readonly isSellerOrAdmin = computed(() => {
    const r = this.role();
    return r === 'Admin' || r === 'Seller';
  });

  private getInitialSession(): UserSession | null {
    try {
      const saved = localStorage.getItem('fym_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  generateDefaultAvatar(name: string): string {
    const clean = encodeURIComponent(name.trim() || 'Flor y Mas');
    return `https://ui-avatars.com/api/?name=${clean}&background=D9536F&color=FFFFFF&rounded=true&bold=true&size=128`;
  }

  setSession(userSession: UserSession): void {
    this.sessionSignal.set(userSession);
    localStorage.setItem('fym_session', JSON.stringify(userSession));
  }

  logout(): void {
    this.sessionSignal.set(null);
    localStorage.removeItem('fym_session');
    this.router.navigate(['/']);
  }
}
