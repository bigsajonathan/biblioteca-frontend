import { Service, signal } from '@angular/core';
import { Cliente } from '../model/cliente';
import { Libro } from '../model/libro';
import { form, required } from '@angular/forms/signals';

export interface ReservaFormModel {
    cliente: Cliente | null;
    fechaReserva: Date | null;
    libro: Libro | null;
}

const emptyReserva = (): ReservaFormModel => ({
    cliente: null,
    fechaReserva: null,
    libro: null,
});

@Service({ autoProvided: false })
export class ReservaForm {

    readonly $model = signal<ReservaFormModel>(emptyReserva());

    readonly $form = form(this.$model, (path) => {
        required(path.cliente);
        required(path.fechaReserva);
    });

    isInvalid() {
        return this.$form().invalid();
    }

    value() {
        return this.$model();
    }

    reset() {
        this.$model.set(emptyReserva());
    }
}
