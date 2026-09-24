import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClienteForm } from '../../../forms/cliente.form';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteDialogStore } from '../../../store/cliente-dialog.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-cliente-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormField,
    FormRoot
  ],
  templateUrl: './cliente-dialog.component.html',
  styleUrl: './cliente-dialog.component.css',
  providers: [ClienteForm, ClienteDialogStore]
})
export class ClienteDialogComponent {

  protected readonly clienteForm = inject(ClienteForm);
  private readonly clienteDialogStore = inject(ClienteDialogStore);
  private readonly clienteService = inject(ClienteService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ClienteDialogComponent>);
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });

  protected $id = computed(() => this.data ? Number(this.data) : null);
  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.clienteDialogStore.setId(this.$id());
    });

    effect(() => {
      if (this.clienteDialogStore.clienteResource.hasValue()) {
        this.clienteForm.patch(this.clienteDialogStore.clienteResource.value());
      }
    });
  }

  operate() {
    if (this.clienteForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const cliente: Cliente = this.clienteForm.value();

    const operation$ = isEdit ? this.clienteService.update(id, cliente) : this.clienteService.save(cliente);

    operation$.subscribe(() => {
      this.notificationService.notify(isEdit ? 'ACTUALIZADO' : 'CREADO');
      this.dialogRef.close(true);
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
