# biblioteca-frontend

Frontend Angular 22 para el sistema de reserva de libros de biblioteca. Consume la API
REST de [`biblioteca-backend`](../biblioteca-backend).

## Prerequisitos

* Node.js 24.x.
* El backend [`biblioteca-backend`](../biblioteca-backend) corriendo en
  `http://localhost:8080` (con PostgreSQL local levantado).

## Configuración

La URL del backend se define en `src/environments/environment.ts` y
`environment.development.ts` (por defecto `http://localhost:8080`).

## Ejecutar

```
npm install
ng serve
```

La app queda disponible en `http://localhost:4200`.

## Pantallas

* Categorías, Libros, Clientes - listar, crear, editar, eliminar.
* Reservas - listado (con filtro por cliente) y registro (`/pages/reservas/nueva`),
  seleccionando cliente y uno o más libros.

## Specs y Agentes de IA

* `.agents/features/reserva-registro.md` - Spec de las pantallas de Reserva.
* `.agents/subagents/angular-vertical-builder.md` - agente para construir verticales
  CRUD, y `.agents/workflows/new-catalog-vertical.md`, que delega en él.
