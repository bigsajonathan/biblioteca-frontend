import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  protected readonly navItems: NavItem[] = [
    { name: 'Categorías', icon: 'category', url: '/pages/categorias' },
    { name: 'Libros', icon: 'menu_book', url: '/pages/libros' },
    { name: 'Clientes', icon: 'group', url: '/pages/clientes' },
    { name: 'Reservas', icon: 'event_available', url: '/pages/reservas' },
  ];
}
