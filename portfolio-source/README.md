# Portfolio source

React + Vite. The repository root contains the published static build.

```sh
npm ci
cp .env.example .env.local
npm run dev
npm run build
```

The example config contains the public Formspree form endpoint, not a secret API key. Submission delivery is configured in Formspree. Keep private environment files untracked.

When publishing a new build, copy the contents of dist into the repository root while preserving the existing the-m-word directory and 404.html routing.
