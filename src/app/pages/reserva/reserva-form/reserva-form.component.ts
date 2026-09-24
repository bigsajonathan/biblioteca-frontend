import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReservaForm } from '../../../forms/reserva.form';
import { ReservaFormStore } from '../../../store/reserva-form.store';
import { ReservaService } from '../../../services/reserva.service';
import { CustomDateAdapter } from '../../../material/custom-adapter';
import { Libro } from '../../../model/libro';
import { DetalleReserva } from '../../../model/detalle-reserva';
import { Reserva } from '../../../model/reserva';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-reserva-form',
  imports: [
    FormRoot,
    FormField,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './reserva-form.component.html',
  styleUrl: './reserva-form.component.css',
  providers: [
    ReservaForm,
    ReservaFormStore,
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ]
})
export class ReservaFormComponent {

  protected readonly reservaForm = inject(ReservaForm);
  protected readonly reservaFormStore = inject(ReservaFormStore);
  private readonly reservaService = inject(ReservaService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected $clientes = this.reservaFormStore.$clientes;
  protected $libros = this.reservaFormStore.$libros;

  protected minDate = new Date();
  protected $librosSeleccionados = signal<Libro[]>([]);

  protected $librosFiltrados = computed(() => {
    const val = this.reservaForm.$model().libro;
    const libros = this.$libros();
    const term = (typeof val === 'string' ? val : val?.tituloLibro ?? '').toLowerCase();

    return libros.filter(libro => libro.tituloLibro.toLowerCase().includes(term));
  });

  protected $puedeGuardar = computed(() =>
    !this.reservaForm.isInvalid() && this.$librosSeleccionados().length > 0
  );

  showLibro(libro: Libro) {
    return libro ? libro.tituloLibro : '';
  }

  agregarLibro() {
    const libro = this.reservaForm.value().libro;
    if (!libro || this.$librosSeleccionados().some(l => l.idLibro === libro.idLibro)) return;

    this.$librosSeleccionados.update(libros => [...libros, libro]);
  }

  quitarLibro(index: number) {
    this.$librosSeleccionados.update(libros => libros.filter((_, i) => i !== index));
  }

  private formatFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  guardar() {
    if (!this.$puedeGuardar()) return;

    const formValue = this.reservaForm.value();

    const reserva = new Reserva();
    reserva.cliente = formValue.cliente;
    reserva.fechaReserva = this.formatFecha(formValue.fechaReserva);
    reserva.detalleReserva = this.$librosSeleccionados().map(libro => {
      const detalle = new DetalleReserva();
      detalle.libro = libro;
      return detalle;
    });

    this.reservaService.saveTransactional(reserva).subscribe(() => {
      this.notificationService.notify('RESERVA CREADA');
      this.router.navigate(['/pages/reservas']);
    });
  }

  cancelar() {
    this.router.navigate(['/pages/reservas']);
  }
}
