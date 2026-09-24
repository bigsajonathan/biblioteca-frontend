import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Reserva } from '../model/reserva';
import { ReservaService } from '../services/reserva.service';

@Service({ autoProvided: false })
export class ReservaStore {

    private readonly reservaService = inject(ReservaService);

    readonly reservasResource = httpResource<Reserva[]>(() => this.reservaService.resourceUrl, { defaultValue: [] });

    readonly $reservas = this.reservasResource.value;
    readonly $loading = this.reservasResource.isLoading;
    readonly $error = this.reservasResource.error;

    reload() {
        this.reservasResource.reload();
    }
}
