import { Component, computed, effect, inject } from '@angular/core';
import { FormField, FormRoot } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CategoriaForm } from '../../../forms/categoria.form';
import { Categoria } from '../../../model/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaDialogStore } from '../../../store/categoria-dialog.store';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-categoria-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule,
    FormField,
    FormRoot
  ],
  templateUrl: './categoria-dialog.component.html',
  styleUrl: './categoria-dialog.component.css',
  providers: [CategoriaForm, CategoriaDialogStore]
})
export class CategoriaDialogComponent {

  protected readonly categoriaForm = inject(CategoriaForm);
  private readonly categoriaDialogStore = inject(CategoriaDialogStore);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<CategoriaDialogComponent>);
  private readonly data = inject<number | null>(MAT_DIALOG_DATA, { optional: true });

  protected $id = computed(() => this.data ? Number(this.data) : null);
  protected $isEdit = computed(() => this.$id() !== null);

  constructor() {
    effect(() => {
      this.categoriaDialogStore.setId(this.$id());
    });

    effect(() => {
      if (this.categoriaDialogStore.categoriaResource.hasValue()) {
        this.categoriaForm.patch(this.categoriaDialogStore.categoriaResource.value());
      }
    });
  }

  operate() {
    if (this.categoriaForm.isInvalid()) return;

    const isEdit = this.$isEdit();
    const id = this.$id();
    const categoria: Categoria = this.categoriaForm.value();

    const operation$ = isEdit ? this.categoriaService.update(id, categoria) : this.categoriaService.save(categoria);

    operation$.subscribe(() => {
      this.notificationService.notify(isEdit ? 'ACTUALIZADO' : 'CREADO');
      this.dialogRef.close(true);
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
