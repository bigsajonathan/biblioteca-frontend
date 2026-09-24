import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { Not404Component } from './pages/not-404/not-404.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pages/libros', pathMatch: 'full' },
    {
        path: 'pages',
        component: LayoutComponent,
        loadChildren: () => import('./pages/pages.routes').then(m => m.pagesRoutes)
    },
    {
        path: '**', component: Not404Component
    }
];
