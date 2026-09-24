# Registro de Reserva

|             |                                     |
| ----------- | ----------------------------------- |
| **Status**  | Implemented                         |
| **Date**    | 2026-09-21                          |
| **Scope**   | `app/pages/reserva`                 |
| **Affects** | `ReservaComponent`, `ReservaFormComponent` |

> Specification for the screens that register and list book reservations.

---

# Part 1 - Specification

*Written before implementation.*

## Problem

A client can reserve one or more books. The screen needs to let a user pick a client,
a date, and one or more books, and submit all of it as a single reservation - plus a
way to see the reservations already made and find the ones belonging to a given client.

## Goal

Two screens: a simple registration form (client + date + one-or-more books) and a list
of existing reservations, filterable by client.

## Scope

In scope:

* `ReservaFormComponent` (`/pages/reservas/nueva`): `mat-select` for `cliente`,
  `mat-datepicker` for `fechaReserva`, an autocomplete + "Agregar" button to build up a
  local list of `Libro`s, and a "Guardar" button that posts the whole reservation in one
  call.
* `ReservaComponent` (`/pages/reservas`): table of existing reservations (fecha,
  cliente, libros), a `mat-select` of clientes to filter the list, and a delete action
  per row.
* `model/detalle-reserva.ts` - only `{ libro: Libro }`. The backend's
  `DetalleReservaDTO.reserva` field is `@JsonBackReference`-only; the frontend never
  sends it (verified against the real `biblioteca-backend` API with `curl` while
  building it - a request body without a `reserva` key per detail line was accepted).
* `services/reserva.service.ts`: `saveTransactional(dto)` (`POST` with the full
  `Reserva` body) and `findByCliente(idCliente)` (`GET /v1/reservas/cliente/{id}`).

Out of scope:

* Editing a reservation - the backend exposes no `PUT /v1/reservas/{id}` (see
  `biblioteca-backend/.agents/features/reserva-flow.md`), so there is no edit dialog,
  only delete.
* A generic multi-field search screen (dni/fecha/etc.) - the backend only exposes a
  single filter (by client id), so a `mat-select` on the list screen covers it; a
  separate search page/dialog would be unused complexity.
* A multi-step wizard - Reserva only has three inputs (client, date, books), so a
  single, simple form screen is enough.
* Enforcing `Libro.disponibleLibro` client-side (e.g. hiding unavailable books from the
  autocomplete) - the backend doesn't enforce or toggle it either (see the backend
  spec's "Out of scope"), so the frontend doesn't invent stricter behavior than the API
  it talks to.

## Decisions

**One page, not a wizard.**
Reserva only has client + date + books, with no further branching steps, so a single
`mat-card`/form is enough - a stepper would be UI complexity this screen doesn't need.

**Books are added to a local list before saving, not submitted one at a time.**
A `signal<Libro[]>` updated immutably (`.update(libros => [...libros, libro])`), an
autocomplete (`MatAutocompleteModule`) to pick a book by title, and a `mat-list` with a
"Quitar" button per entry. This lets the user build up the full set of books before a
single submit, matching the "uno o más libros" requirement.

**The client filter on the list screen is a plain `mat-select`, not a dialog.**
The backend only exposes one filter dimension (by client id), so a dropdown calling
`findByCliente` (or `findAll` when nothing is selected) is enough - a separate search
dialog would solve a filtering problem this screen doesn't have.

**"Guardar" is disabled until at least one book has been added.**
Signal Forms validates `cliente`/`fechaReserva` are set, but the "one or more books"
rule lives outside the form schema, so it's a plain
`$librosSeleccionados().length === 0` check gating the button - matching how
`ReservaDTO.detalleReserva` requires `@NotEmpty` on the backend.

**Reserva date sent to the backend is a plain `yyyy-MM-dd` string, not a full ISO
datetime.**
`Reserva.fechaReserva` on the backend is a `LocalDate`. The date is formatted from the
`Date` object's local year/month/day components (not `.toISOString()`, which converts
to UTC and can shift the calendar day depending on the browser's timezone).

## Contract

Backend calls used (see `biblioteca-backend/.agents/features/reserva-flow.md` for the
server-side contract):

| Action | Call |
|---|---|
| Cargar clientes/libros para el formulario | `GET /v1/clientes`, `GET /v1/libros` |
| Guardar reserva | `POST /v1/reservas` con `{ cliente, fechaReserva, detalleReserva: [{ libro }, ...] }` |
| Listar reservas | `GET /v1/reservas` |
| Filtrar por cliente | `GET /v1/reservas/cliente/{idCliente}` |
| Eliminar reserva | `DELETE /v1/reservas/{id}` |

## Acceptance Criteria

* [x] El botón "Guardar" del formulario está deshabilitado si no se ha seleccionado
      cliente, fecha, o no se ha agregado ningún libro.
* [x] Al guardar, la reserva aparece en `GET /pages/reservas` con fecha, cliente y
      libro(s) correctos.
* [x] El `mat-select` de cliente en el listado filtra correctamente las reservas
      mostradas.
* [x] Eliminar una reserva la quita de la lista.
* [x] No existe ninguna pantalla ni botón de "editar" una reserva.
* [x] El proyecto compila (`ng build`).

Verificado manualmente en el navegador (crear categoría/libro/cliente, registrar una
reserva con dos libros, filtrar por cliente, eliminar) - no hay tests automatizados
para este flujo todavía.

## Expected Implementation

```text
src/app/
├── model/detalle-reserva.ts
├── model/reserva.ts
├── services/reserva.service.ts
├── store/reserva.store.ts              (listado)
├── store/reserva-form.store.ts         (lookups: clientes, libros)
├── forms/reserva.form.ts
├── pages/reserva/reserva.component.ts/html/css
└── pages/reserva/reserva-form/reserva-form.component.ts/html/css
```

---
