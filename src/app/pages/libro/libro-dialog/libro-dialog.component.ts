import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LibroForm } from '../../../forms/libro.form';
import { Libro } from '../../../model/libro';
import { LibroService } from '../../../services/libro.service';
import { LibroDialogStore } from '../../../store/libro-dialog.store';
import { CategoriaStore } from '../../../store/categoria.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-libro-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormField,
    FormRoot
  ],
  templateUrl: './libro-dialog.component.html',
  styleUrl: './libro-dialog.component.css',
  providers: [LibroForm, LibroDialogStore, CategoriaStore]
})
export class LibroDialogComponent {

  protected readonly libroForm = inject(LibroForm);
  private readonly libroDialogStore = inject(LibroDialogStore);
  private readonly libroService = inject(LibroService);
  protected readonly categoriaStore = inject(CategoriaStore);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<LibroDialogComponent>);
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });

  protected $categorias = this.categoriaStore.$categorias;

  protected $id = computed(() => this.data ? Number(this.data) : null);
  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.libroDialogStore.setId(this.$id());
    });

    effect(() => {
      if (this.libroDialogStore.libroResource.hasValue()) {
        this.libroForm.patch(this.libroDialogStore.libroResource.value());
      }
    });
  }

  compareCategorias(a: { idCategoria: number } | null, b: { idCategoria: number } | null) {
    return a && b ? a.idCategoria === b.idCategoria : a === b;
  }

  operate() {
    if (this.libroForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const libro: Libro = this.libroForm.value();

    const operation$ = isEdit ? this.libroService.update(id, libro) : this.libroService.save(libro);

    operation$.subscribe(() => {
      this.notificationService.notify(isEdit ? 'ACTUALIZADO' : 'CREADO');
      this.dialogRef.close(true);
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
