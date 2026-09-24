import { Service, signal } from '@angular/core';
import { Libro } from '../model/libro';
import { form, maxLength, minLength, required } from '@angular/forms/signals';

const emptyLibro = (): Libro => ({
    idLibro: null,
    tituloLibro: '',
    autorLibro: '',
    isbnLibro: '',
    disponibleLibro: true,
    categoria: null,
});

@Service({ autoProvided: false })
export class LibroForm {

    readonly $model = signal<Libro>(emptyLibro());

    readonly $form = form(this.$model, (path) => {
        required(path.tituloLibro);
        maxLength(path.tituloLibro, 150);

        required(path.autorLibro);
        maxLength(path.autorLibro, 100);

        required(path.isbnLibro);
        minLength(path.isbnLibro, 5);
        maxLength(path.isbnLibro, 20);
    });

    readonly isInvalid = () => this.$form().invalid() || !this.$model().categoria;

    patch(libro: Libro) {
        this.$model.set(libro);
    }

    value() {
        return this.$model();
    }

    reset() {
        this.$model.set(emptyLibro());
    }
}
