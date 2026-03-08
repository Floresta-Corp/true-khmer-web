# Server Infrastructure

This folder is for server-side application plumbing.

Put a module here when it supports how the app runs on the server, not a business domain.

Examples in this folder:

- session storage and cookie handling
- route access guards and redirect policy
- shared server-side API transport
- environment or base URL resolution

Do not put feature-specific workflows here.

If a module speaks in business language like auth or onboarding, it belongs in `app/services`.
