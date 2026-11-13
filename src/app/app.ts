import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer.component';
import { FYM_ASSETS, FYM_CONTACT_INFO } from './core/constants/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, CartDrawerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly auth = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly assets = FYM_ASSETS;
  readonly contact = FYM_CONTACT_INFO;

  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
