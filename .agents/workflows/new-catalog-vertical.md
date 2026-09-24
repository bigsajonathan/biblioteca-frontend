# New Catalog Vertical

Create or extend a simple catalog-style CRUD resource (list + create/edit dialog) in this frontend.

## Assigned Agent

Use the `angular-vertical-builder` agent to perform the implementation.

## Required Input

* Resource name in singular form.
* Backend base path under `/v1` that the resource's service should point to.
* Model fields with types and validation rules (required, length, format).
* Any relation to another entity (e.g. a `mat-select` populated from another resource's store).

## Workflow

1. Validate that all required input has been provided.
2. Delegate the implementation to the `angular-vertical-builder` agent.
3. Review the agent's output for completeness.
4. If build or implementation issues are reported, resolve them before continuing.
5. Verify that the implementation satisfies all acceptance criteria.
6. Return a final summary including:

    * Changed files
    * Route(s) added
    * Validation rules
    * Build and verification result

## Acceptance Criteria

* The resource follows the existing model/service/store/dialog-store/form/component pattern.
* Form validation rejects invalid input before the save button is enabled.
* Creating, editing, and deleting a record refreshes the list.
* The route is registered in `pages.routes.ts` and reachable from the sidenav when it's a top-level section.
* The project builds successfully (`ng build`).
* No shared services (`GenericService`, `NotificationService`, `ConfirmDialogComponent`) are modified unless explicitly required.
* The backend URL is never hardcoded - only `environment.HOST` is used.
