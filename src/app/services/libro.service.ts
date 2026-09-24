import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Libro } from '../model/libro';
import { GenericService } from './generic.service';

@Service()
export class LibroService extends GenericService<Libro> {

    protected override url = `${environment.HOST}/v1/libros`;
}
