import { inject, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Libro } from '../model/libro';
import { LibroService } from '../services/libro.service';

@Service({ autoProvided: false })
export class LibroStore {

    private readonly libroService = inject(LibroService);

    readonly librosResource = httpResource<Libro[]>(() => this.libroService.resourceUrl, { defaultValue: [] });

    readonly $libros = this.librosResource.value;
    readonly $loading = this.librosResource.isLoading;
    readonly $error = this.librosResource.error;

    reload() {
        this.librosResource.reload();
    }
}
