import { Routes } from '@angular/router';
import { CategoriaComponent } from './categoria/categoria.component';
import { LibroComponent } from './libro/libro.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ReservaComponent } from './reserva/reserva.component';
import { ReservaFormComponent } from './reserva/reserva-form/reserva-form.component';

export const pagesRoutes: Routes = [
    { path: 'categorias', component: CategoriaComponent },
    { path: 'libros', component: LibroComponent },
    { path: 'clientes', component: ClienteComponent },
    { path: 'reservas', component: ReservaComponent },
    { path: 'reservas/nueva', component: ReservaFormComponent },
];
