import { Component, effect, inject, viewChild } from '@angular/core';
import { Categoria } from '../../model/categoria';
import { CategoriaStore } from '../../store/categoria.store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CategoriaDialogComponent } from './categoria-dialog/categoria-dialog.component';
import { CategoriaService } from '../../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-categoria',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
  providers: [CategoriaStore]
})
export class CategoriaComponent {

  private readonly categoriaStore = inject(CategoriaStore);
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Categoria>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected $categorias = this.categoriaStore.$categorias;

  protected displayedColumns: string[] = ['idCategoria', 'nombreCategoria', 'descripcionCategoria', 'estadoCategoria', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$categorias();
      const p = this.$paginator();
      const s = this.$sort();

      this.dataSource.data = data;
      this.dataSource.paginator = p;
      this.dataSource.sort = s;
    });
  }

  private setupNotificationEffect() {
    effect(() => {
      const message = this.notificationService.$message();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
        this.notificationService.clear();
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(idCategoria?: number) {
    this.dialog
      .open(CategoriaDialogComponent, { width: '400px', data: idCategoria ?? null })
      .afterClosed()
      .pipe(filter((saved) => saved))
      .subscribe(() => this.categoriaStore.reload());
  }

  delete(idCategoria: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.categoriaService.delete(idCategoria)),
        tap(() => this.notificationService.notify('ELIMINADO'))
      )
      .subscribe(() => this.categoriaStore.reload());
  }
}
