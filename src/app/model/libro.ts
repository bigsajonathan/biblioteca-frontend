import { Categoria } from './categoria';

export class Libro {
    idLibro: number;
    tituloLibro: string;
    autorLibro: string;
    isbnLibro: string;
    disponibleLibro: boolean;
    categoria: Categoria;
}
