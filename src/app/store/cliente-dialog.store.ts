import { computed, inject, Service, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente.service';

@Service({ autoProvided: false })
export class ClienteDialogStore {

    private readonly clienteService = inject(ClienteService);
    readonly $id = signal<number | null>(null);

    private readonly $clienteRequest = computed(() => {
        const id = this.$id();

        return id ? `${this.clienteService.resourceUrl}/${id}` : undefined;
    });

    readonly clienteResource = httpResource<Cliente>(() => this.$clienteRequest());

    setId(id: number | null) {
        this.$id.set(id);
    }
}
