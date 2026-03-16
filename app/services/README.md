# Domain Services

This folder is for business-domain modules.

Put a module here when it represents a product capability or workflow, even if it talks to a backend API.

Examples in this folder:

- authentication flows
- onboarding state and step operations

These modules should speak in domain language.

They can depend on `app/lib/server`, but `app/lib/server` should not depend on domain-specific UI concerns.
