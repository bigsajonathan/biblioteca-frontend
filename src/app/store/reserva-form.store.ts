import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente.service';
import { Libro } from '../model/libro';
import { LibroService } from '../services/libro.service';

@Service({ autoProvided: false })
export class ReservaFormStore {

    private readonly clienteService = inject(ClienteService);
    private readonly libroService = inject(LibroService);

    readonly clienteResource = httpResource<Cliente[]>(() => this.clienteService.resourceUrl, { defaultValue: [] });
    readonly libroResource = httpResource<Libro[]>(() => this.libroService.resourceUrl, { defaultValue: [] });

    readonly $clientes = this.clienteResource.value;
    readonly $libros = this.libroResource.value;
}
