import { Cliente } from './cliente';
import { DetalleReserva } from './detalle-reserva';

export class Reserva {
    idReserva: number;
    cliente: Cliente;
    fechaReserva: string;
    detalleReserva: DetalleReserva[];
}
