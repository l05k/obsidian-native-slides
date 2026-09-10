# AGENTS.md — Agent Operating Rules

Rules that agents (AI or human) MUST follow when working in this repository. Detailed specifications live in the `skills/` directory; each rule below links to its skill.

## Rule 1 — Development workflow (CLI-first)

Every change must follow the **branch → PR → human review → cleanup** workflow, driven entirely by CLI tools. Never commit directly to `main`. Before every commit, confirm that all documentation affected by the change (`README.md` / `README-zh.md`, `docs/`, `CHANGELOG.md`) is updated in the same commit — never ship code without its docs.

**Full instructions:** [skills/dev-workflow/SKILL.md](skills/dev-workflow/SKILL.md)

## Reusable agent skills

`.agents/skills/` vendors the published [mattpocock/skills](https://github.com/mattpocock/skills) set — grilling a plan, test-first implementation, code review, debugging loops, handoffs. Read the matching `SKILL.md` before starting that kind of work instead of improvising a process. Layout, update commands and the pinned `skills-lock.json` are documented in [docs/development.md](docs/development.md#agent-skills-vendored).
