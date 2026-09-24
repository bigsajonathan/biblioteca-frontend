import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Reserva } from '../../model/reserva';
import { ReservaStore } from '../../store/reserva.store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ReservaService } from '../../services/reserva.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../model/cliente';
import { httpResource } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-reserva',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
  providers: [ReservaStore]
})
export class ReservaComponent {

  private readonly reservaStore = inject(ReservaStore);
  private readonly reservaService = inject(ReservaService);
  private readonly clienteService = inject(ClienteService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly dataSource = new MatTableDataSource<Reserva>();
  protected readonly $paginator = viewChild(MatPaginator);
  protected readonly $sort = viewChild(MatSort);
  private readonly snackBar = inject(MatSnackBar);
  private readonly notificationService = inject(NotificationService);

  private readonly clientesResource = httpResource<Cliente[]>(() => this.clienteService.resourceUrl, { defaultValue: [] });
  protected $clientes = this.clientesResource.value;

  protected $clienteFiltro = signal<number | null>(null);

  protected displayedColumns: string[] = ['idReserva', 'fechaReserva', 'cliente', 'libros', 'actions'];

  constructor() {
    this.setupTableEffect();
    this.setupNotificationEffect();
  }

  private setupTableEffect() {
    effect(() => {
      const data = this.reservaStore.$reservas();
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

  librosDeReserva(reserva: Reserva): string {
    return reserva.detalleReserva.map(d => d.libro.tituloLibro).join(', ');
  }

  filtrarPorCliente(idCliente: number | null) {
    this.$clienteFiltro.set(idCliente);

    if (idCliente === null) {
      this.reservaStore.reload();
      return;
    }

    this.reservaService.findByCliente(idCliente).subscribe(reservas => this.dataSource.data = reservas);
  }

  nuevaReserva() {
    this.router.navigate(['/pages/reservas/nueva']);
  }

  delete(idReserva: number) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.reservaService.delete(idReserva)),
        tap(() => this.notificationService.notify('ELIMINADO'))
      )
      .subscribe(() => {
        const idCliente = this.$clienteFiltro();
        idCliente === null ? this.reservaStore.reload() : this.filtrarPorCliente(idCliente);
      });
  }
}
