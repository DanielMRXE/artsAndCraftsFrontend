import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { FYM_ASSETS, FYM_CONTACT_INFO } from './core/constants/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly auth = inject(AuthService);
  readonly assets = FYM_ASSETS;
  readonly contact = FYM_CONTACT_INFO;
}
