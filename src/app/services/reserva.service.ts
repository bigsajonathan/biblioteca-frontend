import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Reserva } from '../model/reserva';
import { GenericService } from './generic.service';

@Service()
export class ReservaService extends GenericService<Reserva> {

    protected override url: string = `${environment.HOST}/v1/reservas`;

    saveTransactional(reserva: Reserva) {
        return this.http.post(this.url, reserva);
    }

    findByCliente(idCliente: number) {
        return this.http.get<Reserva[]>(`${this.url}/cliente/${idCliente}`);
    }
}
