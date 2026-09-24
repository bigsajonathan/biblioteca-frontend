import { Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Categoria } from '../model/categoria';
import { GenericService } from './generic.service';

@Service()
export class CategoriaService extends GenericService<Categoria> {

    protected override url = `${environment.HOST}/v1/categorias`;
}
