import type { DocSection } from '@/modules/doc/shared/types';

export const RULES_SKILLS_DOC = {
  title: 'Rules and Skills (.claude)',
  description:
    'The .claude folder holds the written standards of this project in a form that both people and AI assistants follow. Rules say what is allowed, skills say how to do a task step by step, hooks enforce the mechanical parts. Use them together with the existing modules (auth, starter) as working examples.',
} as const;

const STRUCTURE_CODE = `.claude/
  rules/     14 short standards, loaded automatically by file path (paths: globs)
  skills/    step by step recipes: new-feature, add-endpoint, add-translation, verify, fe-review
  agents/    fe-reviewer (read-only review), test-writer (writes *.spec.ts)
  hooks/     scripts that run after an edit or before a shell command
  settings.json  permissions and hook wiring

AGENTS.md    shared summary for Codex, Gemini CLI and Cursor (CLAUDE.md imports it)`;

const RULES_ITEMS = [
  {
    name: 'data-fetching.md',
    description:
      'api client, apiRoute, QUERY_KEYS, services return typed payloads, useDataTable / useDataInfiniteScroll, errors via apiError. Matches: services, composables, .vue.',
  },
  {
    name: 'forms-and-validation.md',
    description:
      'vee-validate + yup, schemas in schemas/*.schema.ts, shared rules from @workspace/core/lib/yup, Field.* components, applyApiErrorToForm, uploads with useFormMedia.',
  },
  {
    name: 'module-structure.md',
    description:
      'Layout of src/modules/<feature>. Shared code moves to src/ only when a second module needs it.',
  },
  {
    name: 'routing.md',
    description:
      'Route names from paths, <feature>.routes.ts and <feature>.paths.ts, lazy pages, meta.title, guards.',
  },
  {
    name: 'vue-ui.md',
    description:
      'script setup, reuse the packages/ui components, PageWrapper, RTL logical classes, TEST_IDS, formatters.',
  },
  {
    name: 'typescript.md',
    description:
      'No any, interface over type, import type, files under 300 lines, functions under 50.',
  },
  {
    name: 'i18n.md and styling.md',
    description:
      'JSON locales in en and ar, no hardcoded strings. Tokens from token.css, cn(), CVA.',
  },
  {
    name: 'boundaries.md',
    description:
      'Import boundaries: apps never import across apps, packages never import an app, shared code goes through @workspace/core, @workspace/ui and @workspace/locales.',
  },
  {
    name: 'state-management.md, permissions.md, testing.md',
    description: 'Pinia for client state only, can("resource.action"), Vitest with MSW.',
  },
] as const;

const SKILLS_ITEMS = [
  {
    name: '/new-feature',
    description:
      'Scaffold a module: routes, paths, page, service, composable, schema, locales, test ids.',
  },
  {
    name: '/add-endpoint',
    description: 'Route in endpoints.ts, key in QUERY_KEYS, types, service, composable, test.',
  },
  {
    name: '/add-translation',
    description: 'Add a key to both en and ar JSON files and keep key order identical.',
  },
  {
    name: '/verify',
    description:
      'Lint changed files, type-check and run only the relevant spec before you say done.',
  },
  {
    name: '/fe-review',
    description: 'Review your branch diff against all the rules and list findings as a table.',
  },
] as const;

const WORKFLOW_CODE = `New feature "assets" - how the rules and skills work together

1. Read an existing module  src/modules/auth and src/modules/starter (services,
                            schemas, composables, pages) = the target shape
2. /new-feature             creates the folders and registers paths and routes
3. API contract             check global.d.ts matches the backend (API Contract page)
4. /add-endpoint            route + QUERY_KEY + types + service (Services page)
5. Table page               useDataTable + Table + columns (useDataTable pages)
6. Form                     schema + mutation + useXForm + template (Building Forms page)
7. Upload                   useFormMedia + Field.ImageUpload (Uploads page)
8. /add-translation         every label in en and ar
9. test ids + permissions   TEST_IDS keys, can('assets.create'), route guard
10. /verify, then /fe-review before the PR`;

export const RULES_SKILLS_SECTIONS: readonly DocSection[] = [
  {
    title: 'What is inside .claude',
    description:
      'Rules and skills are plain Markdown: read them like documentation even if you do not use an AI assistant.',
    code: STRUCTURE_CODE,
    header: 'structure',
  },
  {
    title: 'Rules',
    description:
      'Short and strict. Each rule starts with a paths: list, so it is loaded when you edit a matching file.',
    items: RULES_ITEMS,
  },
  {
    title: 'Skills',
    description:
      'Type the name in Claude Code to run the recipe. Other tools can read .claude/skills/<name>/SKILL.md and follow it.',
    items: SKILLS_ITEMS,
  },
  {
    title: 'Building a feature with rules and skills',
    description: 'Follow this order. Each step names the page that explains it.',
    code: WORKFLOW_CODE,
    header: 'workflow',
  },
];
