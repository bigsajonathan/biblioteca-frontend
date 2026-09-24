import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Categoria } from '../model/categoria';
import { CategoriaService } from '../services/categoria.service';

@Service({ autoProvided: false })
export class CategoriaStore {

    private readonly categoriaService = inject(CategoriaService);

    readonly categoriasResource = httpResource<Categoria[]>(() => this.categoriaService.resourceUrl, { defaultValue: [] });

    readonly $categorias = this.categoriasResource.value;
    readonly $loading = this.categoriasResource.isLoading;
    readonly $error = this.categoriasResource.error;

    reload() {
        this.categoriasResource.reload();
    }
}
