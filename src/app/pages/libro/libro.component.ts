import { Component, effect, inject, viewChild } from '@angular/core';
import { Libro } from '../../model/libro';
import { LibroStore } from '../../store/libro.store';
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
import { LibroDialogComponent } from './libro-dialog/libro-dialog.component';
import { LibroService } from '../../services/libro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-libro',
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
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.css',
  providers: [LibroStore]
})
export class LibroComponent {

  private readonly libroStore = inject(LibroStore);
  private readonly libroService = inject(LibroService);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Libro>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected $libros = this.libroStore.$libros;

  protected displayedColumns: string[] = ['idLibro', 'tituloLibro', 'autorLibro', 'isbnLibro', 'categoria', 'disponibleLibro', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$libros();
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

  openDialog(idLibro?: number) {
    this.dialog
      .open(LibroDialogComponent, { width: '450px', data: idLibro ?? null })
      .afterClosed()
      .pipe(filter((saved) => saved))
      .subscribe(() => this.libroStore.reload());
  }

  delete(idLibro: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.libroService.delete(idLibro)),
        tap(() => this.notificationService.notify('ELIMINADO'))
      )
      .subscribe(() => this.libroStore.reload());
  }
}
