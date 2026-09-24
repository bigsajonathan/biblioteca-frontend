import { Service, signal } from '@angular/core';
import { Categoria } from '../model/categoria';
import { form, maxLength, minLength, required } from '@angular/forms/signals';

const emptyCategoria = (): Categoria => ({
    idCategoria: null,
    nombreCategoria: '',
    descripcionCategoria: '',
    estadoCategoria: true,
});

@Service({ autoProvided: false })
export class CategoriaForm {

    readonly $model = signal<Categoria>(emptyCategoria());

    readonly $form = form(this.$model, (path) => {
        required(path.nombreCategoria);
        minLength(path.nombreCategoria, 3);
        maxLength(path.nombreCategoria, 50);

        required(path.descripcionCategoria);
        minLength(path.descripcionCategoria, 3);
        maxLength(path.descripcionCategoria, 150);
    });

    readonly isInvalid = () => this.$form().invalid();

    patch(categoria: Categoria) {
        this.$model.set(categoria);
    }

    value() {
        return this.$model();
    }

    reset() {
        this.$model.set(emptyCategoria());
    }
}
