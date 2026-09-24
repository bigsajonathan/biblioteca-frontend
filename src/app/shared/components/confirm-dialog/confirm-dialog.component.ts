import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>¿Estás seguro de que deseas eliminar este registro?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button type="button" (click)="onNoClick()">
        <span>Cancelar</span>
        <mat-icon>cancel</mat-icon>
      </button>
      <button mat-flat-button type="button" class='cancel-button' [mat-dialog-close]="true" cdkFocusInitial>
        <span>Eliminar</span>
        <mat-icon>delete</mat-icon>
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
