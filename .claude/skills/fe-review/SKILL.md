---
name: fe-review
description: Review the current branch's frontend changes against this repo's Turborepo monorepo architecture rules. Use when asked to review a diff, branch, PR, or "my changes".
argument-hint: "[base branch or PR number]"
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git merge-base:*), Bash(gh pr diff:*), Bash(pnpm exec eslint:*), Read, Grep, Glob
---

# Frontend review

Review ONLY the diff, not the whole codebase.

1. Pick the base: the argument if given (a branch name, or a PR number for `gh pr diff <n>`), else `origin/main`, else `origin/master`, else `origin/develop`.
2. Get the diff: `git diff --stat <base>...HEAD`, then `git diff <base>...HEAD -- '*.vue' '*.ts' '*.json' '*.css'`. If the branch has uncommitted work, include `git diff HEAD`.
3. Run `pnpm exec eslint <changed .vue/.ts files>` and keep only errors on changed lines.
4. Delegate to the `fe-reviewer` subagent with the diff when your tool supports subagents (Claude Code: Agent tool; Gemini CLI: `@fe-reviewer`), so file reads stay out of the main context. Otherwise apply the checklist in `.claude/agents/fe-reviewer.md` yourself.
5. Check each changed hunk against this list:
   - Reuse: new component/composable that duplicates something in `@workspace/ui` (`ui`, `form`, `data-table`), `@workspace/core` (`composables`, `utils`, `lib`)
   - Raw `<input>`, `<select>`, custom modal, manual pagination/scroll
   - Inline `queryKey: [...]`, hardcoded URL strings, manual toast in `try/catch`, data mirrored into Pinia
   - Inline date/currency formatting; missing `data-test-id` from `TEST_IDS`
   - Physical Tailwind classes (`ml- mr- pl- pr- left- right- text-left text-right`) and raw hex colors
   - Hard-coded UI text; `en`/`ar` key mismatch; English left in `ar`
   - `any`, `@ts-ignore`, missing `import type`
   - New logic without a spec
   - Which app/package each changed file belongs to, and whether it respects that boundary
   - Relative imports across `apps/*`; `core` importing `ui` or an app alias; browser globals in `packages/*` or `apps/website`
   - Code that now exists in two apps and should live in a `@workspace/*` package (or the reverse: app-only code pushed into a package)
   - A package change that affects every app: check each consumer's usage in the diff or by grep
   - New dependency declared in the right `package.json`
6. Output a table: `file:line | severity (blocker/major/nit) | rule | fix`. No praise, no summary of what the code does. Max 25 rows; group repeats. If there are no findings, say "No findings."
