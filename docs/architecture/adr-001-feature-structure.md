# ADR 001: Feature-Based Architecture

## Status
Accepted

## Context
The project was initially structured with flat directories (`components/`, `pages/`). As the project scales to include multiple roles (Admin, Client, Freelancer, Coordinator) and complex domains (Escrow, Disputes), a flat structure would lead to tight coupling and a "spaghetti" codebase.

## Decision
We adopted a **Feature-Slicing** approach (inspired by Domain-Driven Design):
- `src/features/`: Encapsulates business logic, views, and components specific to a domain.
- `src/shared/`: Contains cross-cutting UI primitives and utilities.
- `src/layouts/`: Manages structural wrappers.

## Consequences
- **Positive:** Improved modularity, easier testing, and clearer ownership of code.
- **Negative:** Slightly deeper folder nesting.
