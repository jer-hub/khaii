# Contributing to Our Journey

Thanks for helping improve this project.

## Ground rules

- Keep changes focused and minimal for the stated goal.
- Prefer updates in `data/content.ts` for personalization/content requests.
- Do not commit secrets, private credentials, or personal data.
- Use clear commit messages and describe user-facing impact in PRs.

## Development setup

1. Install dependencies:
   - `npm install`
2. Start local development:
   - `npm run dev`
3. Run checks before opening a PR:
   - `npm run lint`
   - `npm run build`

## Pull request checklist

- [ ] Change is scoped to one concern
- [ ] Documentation is updated when behavior/content workflow changes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] No secrets or sensitive values are introduced

## Coding notes

- Follow existing TypeScript and React patterns in the touched area.
- Avoid introducing new dependencies unless required.
- Keep UI behavior mobile-first and PWA-safe.
- For personalization/content-only changes, prefer `data/content.ts` and assets under `public/`.
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/PERSONALIZATION.md](docs/PERSONALIZATION.md) for deeper context.
