import { Service, signal } from '@angular/core';
import { Cliente } from '../model/cliente';
import { email, form, maxLength, minLength, required } from '@angular/forms/signals';

const emptyCliente = (): Cliente => ({
    idCliente: null,
    nombresCliente: '',
    apellidosCliente: '',
    cedulaCliente: '',
    emailCliente: '',
});

@Service({ autoProvided: false })
export class ClienteForm {

    readonly $model = signal<Cliente>(emptyCliente());

    readonly $form = form(this.$model, (path) => {
        required(path.nombresCliente);
        minLength(path.nombresCliente, 2);
        maxLength(path.nombresCliente, 60);

        required(path.apellidosCliente);
        minLength(path.apellidosCliente, 2);
        maxLength(path.apellidosCliente, 60);

        required(path.cedulaCliente);
        minLength(path.cedulaCliente, 5);
        maxLength(path.cedulaCliente, 15);

        required(path.emailCliente);
        email(path.emailCliente);
        maxLength(path.emailCliente, 100);
    });

    readonly isInvalid = () => this.$form().invalid();

    patch(cliente: Cliente) {
        this.$model.set(cliente);
    }

    value() {
        return this.$model();
    }

    reset() {
        this.$model.set(emptyCliente());
    }
}
