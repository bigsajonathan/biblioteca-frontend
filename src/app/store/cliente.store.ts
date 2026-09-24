import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente.service';

@Service({ autoProvided: false })
export class ClienteStore {

    private readonly clienteService = inject(ClienteService);

    readonly clientesResource = httpResource<Cliente[]>(() => this.clienteService.resourceUrl, { defaultValue: [] });

    readonly $clientes = this.clientesResource.value;
    readonly $loading = this.clientesResource.isLoading;
    readonly $error = this.clientesResource.error;

    reload() {
        this.clientesResource.reload();
    }
}
