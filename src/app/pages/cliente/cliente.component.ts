import { Component, effect, inject, viewChild } from '@angular/core';
import { Cliente } from '../../model/cliente';
import { ClienteStore } from '../../store/cliente.store';
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
import { ClienteDialogComponent } from './cliente-dialog/cliente-dialog.component';
import { ClienteService } from '../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-cliente',
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
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
  providers: [ClienteStore]
})
export class ClienteComponent {

  private readonly clienteStore = inject(ClienteStore);
  private readonly clienteService = inject(ClienteService);
  private readonly dialog = inject(MatDialog);

  protected readonly dataSource = new MatTableDataSource<Cliente>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  protected $clientes = this.clienteStore.$clientes;

  protected displayedColumns: string[] = ['idCliente', 'nombresCliente', 'apellidosCliente', 'cedulaCliente', 'emailCliente', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.$clientes();
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

  openDialog(idCliente?: number) {
    this.dialog
      .open(ClienteDialogComponent, { width: '400px', data: idCliente ?? null })
      .afterClosed()
      .pipe(filter((saved) => saved))
      .subscribe(() => this.clienteStore.reload());
  }

  delete(idCliente: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.clienteService.delete(idCliente)),
        tap(() => this.notificationService.notify('ELIMINADO'))
      )
      .subscribe(() => this.clienteStore.reload());
  }
}
