# AppBox

## Goals

- Make flexibility of developer-driven software available to companies lacking the budget to hire consultants and developers for each change.
- Support major business processess such as
  - Main CRM; manage customers, inventory, orders, sales, etc
  - Website; host website with data from within the platform
  - Flexibility within UI design and business logic.

## Current state

The project was started as a PoC. However, it has advanced beyond that state. It's nowhere close to a beta though. In day-to-day use it's reasonably stable and has many functions. However, these things are still in-progress.

- A rigorous security audit.
  - Priority 1: `supervisor` and it's OS interactions
  - Priority 2: data security in `server`
  - Priority 3: In-app role escalation
  - Priority 4: WA-level security
  - ... more
- Standardisation of the API and data-model
- Data-integrity
- If `engine` isn't running, formulas and automations don't get executed
- When the core data structure changes, propagate these changes to everyone's instance
