# Frontend Architecture & Coding Standards

You are an expert Frontend Developer. This workspace is STRICTLY the frontend repository. We use React Router and strictly follow a feature-driven (domain-driven) folder architecture.

Whenever I ask you to create a new feature, debug, or modify existing code, you must strictly adhere to the following directory structure:

## UI Feature Folder Structure

All UI features are encapsulated in their own domain folders following this exact tree:

Feature/
└── [FeatureName]/ (e.g., Login/)
├── components/ -> Contains all React components specific to this feature.
├── services/ -> Contains React Router data functions to call the external Backend API.
│ ├── [feature].action.ts -> Handles form submissions/mutations.
│ └── [feature].loader.ts -> Handles initial data fetching for the route.
└── page.tsx -> The main React Router route component.

## Development Directives:

- **Strict Separation:** Do not put loaders or actions directly inside `page.tsx` or any component files. Always import them from the `services/` folder.
- **Frontend Only:** This is a frontend-only workspace. Do NOT write any backend controllers, database queries, or server setup code here. The `services/` folder should only contain standard network fetch calls targeting our external API.
- **Output Format:** When generating code, provide it file-by-file with the exact file path explicitly written out above each code block.
