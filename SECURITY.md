# Security Policy

## Supported versions

This project is maintained on the default branch (`main`). Security fixes are applied there first.

## Important: password gate

The unlock password in `data/content.ts` (`SITE.password`) is **client-side UX only**. It is not encryption, authorization, or access control. Anyone who can view the deployed JavaScript or the source repository can recover it.

Guidelines:

- Treat the password as personalization for a private gift site.
- Do not put real account credentials, API keys, or private documents in this repo.
- Change `SITE.password` before sharing a public deployment if the sample value should not be guessable.

## Reporting a vulnerability

Please do **not** open public issues for security vulnerabilities.

Instead:

1. Use [GitHub private vulnerability reporting](https://github.com/jer-hub/khaii/security/advisories/new) for this repository.
2. Include clear reproduction steps, impact, and affected files/components.
3. Share any proposed mitigation if available.

You can expect an acknowledgment as soon as maintainers are available, followed by triage and remediation updates.
