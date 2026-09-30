#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.resolve(rootDir, 'apps');
const rootPkgPath = path.resolve(rootDir, 'package.json');

// Supported templates & their aliases
const TEMPLATES = {
  'base-template': {
    name: 'base-template',
    label: 'Vite SPA Dashboard (base-template)',
    aliases: ['base-template', 'base', 'spa', 'vite', 'dashboard'],
  },
  website: {
    name: 'website',
    label: 'Nuxt 3 SSR Website (website)',
    aliases: ['website', 'web', 'nuxt', 'ssr'],
  },
};

// Reserved directory and package names that cannot be created as tenants
const RESERVED_NAMES = [
  'base-template',
  'website',
  'core',
  'ui',
  'locales',
  'eslint-config',
  'tsconfig',
];

function printHelp() {
  console.log(`
\x1b[1m\x1b[34mTenant Scaffolding Tool\x1b[0m

\x1b[1mUsage:\x1b[0m
  pnpm run tenant:add <tenant-name> [template] [port]
  pnpm run tenant:add <tenant-name> --template=<website|base-template> [--port=<port>]

\x1b[1mAvailable Templates:\x1b[0m
  • \x1b[33mbase-template\x1b[0m (default) : Vite-based SPA dashboard template
  • \x1b[33mwebsite\x1b[0m                 : Nuxt 3 SSR/ISR website template

\x1b[1mOptions:\x1b[0m
  -t, --template <name>  Template to clone (default: base-template)
  -p, --port <number>    Dev server port for the new tenant
  -h, --help             Show this help message

\x1b[1mExamples:\x1b[0m
  pnpm run tenant:add tenant-c
  pnpm run tenant:add tenant-c website
  pnpm run tenant:add tenant-c base-template 3003
  pnpm run tenant:add tenant-c --template=website --port=3005
`);
}

// Parse command line arguments
function parseArgs(args) {
  const parsed = {
    tenantName: null,
    template: null,
    port: null,
    help: false,
  };

  const positionals = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      return parsed;
    }

    if (arg.startsWith('--template=')) {
      parsed.template = arg.split('=')[1];
    } else if (arg === '--template' || arg === '-t') {
      parsed.template = args[++i];
    } else if (arg.startsWith('--port=')) {
      parsed.port = arg.split('=')[1];
    } else if (arg === '--port' || arg === '-p') {
      parsed.port = args[++i];
    } else if (arg.startsWith('--name=')) {
      parsed.tenantName = arg.split('=')[1];
    } else if (arg === '--name' || arg === '-n') {
      parsed.tenantName = args[++i];
    } else if (!arg.startsWith('-')) {
      positionals.push(arg);
    }
  }

  // Resolve positional arguments if not specified via flags
  if (!parsed.tenantName && positionals.length > 0) {
    parsed.tenantName = positionals[0];
  }
  if (!parsed.template && positionals.length > 1) {
    parsed.template = positionals[1];
  }
  if (!parsed.port && positionals.length > 2) {
    parsed.port = positionals[2];
  }

  return parsed;
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

if (!args.tenantName) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Tenant name is required.');
  printHelp();
  process.exit(1);
}

// Normalize tenant name: allow 'tenant-c', '@workspace/tenant-c', or 'apps/tenant-c'
const tenantName = args.tenantName
  .replace(/^@workspace\//, '')
  .replace(/^apps\//, '')
  .trim();

if (!/^[a-z0-9-_]+$/i.test(tenantName)) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Error: Invalid tenant name "${tenantName}". Use alphanumeric characters, hyphens, or underscores.`
  );
  process.exit(1);
}

if (RESERVED_NAMES.includes(tenantName.toLowerCase())) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Error: "${tenantName}" is a reserved core template/package name and cannot be used as a tenant name.`
  );
  process.exit(1);
}

// Resolve template
let selectedTemplateKey = 'base-template';
if (args.template) {
  const normalizedInput = args.template.trim().toLowerCase();
  const match = Object.entries(TEMPLATES).find(([, config]) =>
    config.aliases.includes(normalizedInput)
  );

  if (!match) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `Error: Unknown template "${args.template}". Available templates: base-template, website`
    );
    process.exit(1);
  }
  selectedTemplateKey = match[0];
} else {
  console.log(
    `\x1b[36mℹ No template specified. Defaulting to 'base-template' (available: base-template, website).\x1b[0m`
  );
}

const selectedTemplate = TEMPLATES[selectedTemplateKey];
const templateSourceDir = path.resolve(appsDir, selectedTemplate.name);
const targetDir = path.resolve(appsDir, tenantName);

if (!fs.existsSync(templateSourceDir)) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Error: Source template not found at apps/${selectedTemplate.name}`
  );
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: Tenant folder already exists at apps/${tenantName}`);
  process.exit(1);
}

console.log(
  `\n\x1b[34m▶ Creating new tenant: \x1b[1m${tenantName}\x1b[0m\x1b[34m from template \x1b[1m${selectedTemplate.label}\x1b[0m...`
);

// Filter out build output and dependency artifacts during copy
const filterFunc = (src) => {
  const base = path.basename(src);
  return !['node_modules', 'dist', '.output', '.nuxt', '.turbo', '.DS_Store', '.git'].includes(
    base
  );
};

try {
  fs.cpSync(templateSourceDir, targetDir, { recursive: true, filter: filterFunc });
  console.log(
    `\x1b[32m✔ Scaffolding copied from apps/${selectedTemplate.name} to apps/${tenantName}\x1b[0m`
  );

  // 1. Update package.json in target tenant
  const targetPkgPath = path.resolve(targetDir, 'package.json');
  if (fs.existsSync(targetPkgPath)) {
    const pkgContent = JSON.parse(fs.readFileSync(targetPkgPath, 'utf8'));
    pkgContent.name = `@workspace/${tenantName}`;
    pkgContent.dependencies = pkgContent.dependencies || {};
    pkgContent.dependencies['@workspace/core'] = 'workspace:*';
    pkgContent.dependencies['@workspace/ui'] = 'workspace:*';
    pkgContent.dependencies['@workspace/locales'] = 'workspace:*';
    fs.writeFileSync(targetPkgPath, JSON.stringify(pkgContent, null, 2) + '\n', 'utf8');
    console.log(`\x1b[32m✔ Updated package.json name to @workspace/${tenantName}\x1b[0m`);
  }

  // 2. Template-specific configurations
  if (selectedTemplateKey === 'website') {
    // If copying website template, replace header brand display if present
    const defaultLayoutPath = path.resolve(targetDir, 'layouts/default.vue');
    if (fs.existsSync(defaultLayoutPath)) {
      const layoutContent = fs.readFileSync(defaultLayoutPath, 'utf8');
      const updatedLayout = layoutContent.replace(
        /@workspace\/website/g,
        `@workspace/${tenantName}`
      );
      fs.writeFileSync(defaultLayoutPath, updatedLayout, 'utf8');
    }

    // Configure port if specified
    if (args.port) {
      const nuxtConfigPath = path.resolve(targetDir, 'nuxt.config.ts');
      if (fs.existsSync(nuxtConfigPath)) {
        let nuxtConfig = fs.readFileSync(nuxtConfigPath, 'utf8');
        if (/devServer:\s*\{/.test(nuxtConfig)) {
          nuxtConfig = nuxtConfig.replace(/port:\s*\d+/, `port: ${args.port}`);
        } else {
          nuxtConfig = nuxtConfig.replace(
            /export default defineNuxtConfig\(\{/,
            `export default defineNuxtConfig({\n  devServer: { port: ${args.port} },`
          );
        }
        fs.writeFileSync(nuxtConfigPath, nuxtConfig, 'utf8');
        console.log(`\x1b[32m✔ Configured Nuxt devServer port to ${args.port}\x1b[0m`);
      }
    }
  } else if (selectedTemplateKey === 'base-template') {
    // Update .env title if present
    const envPath = path.resolve(targetDir, '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(
        /VITE_APP_TITLE=.*/,
        `VITE_APP_TITLE=${tenantName.toUpperCase()}`
      );
      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    // Configure port if specified
    if (args.port) {
      const viteConfigPath = path.resolve(targetDir, 'vite.config.ts');
      if (fs.existsSync(viteConfigPath)) {
        let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
        viteConfig = viteConfig.replace(/port:\s*\d+/, `port: ${args.port}`);
        fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
        console.log(`\x1b[32m✔ Configured Vite dev server port to ${args.port}\x1b[0m`);
      }
    }
  }

  // 3. Update root package.json scripts with dev and build commands for new tenant
  if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    rootPkg.scripts = rootPkg.scripts || {};
    rootPkg.scripts[`dev:${tenantName}`] = `pnpm --filter @workspace/${tenantName} dev`;
    rootPkg.scripts[`build:${tenantName}`] = `pnpm --filter @workspace/${tenantName} build`;
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n', 'utf8');
    console.log(
      `\x1b[32m✔ Added dev:${tenantName} and build:${tenantName} to root package.json\x1b[0m`
    );
  }

  // 4. Run pnpm install to link dependencies in workspace
  console.log('\n\x1b[34m▶ Running pnpm install to register new workspace package...\x1b[0m');
  execSync('pnpm install', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[32m%s\x1b[0m', `✨ Successfully created tenant: ${tenantName}!`);
  console.log(`Template: \x1b[33m${selectedTemplate.label}\x1b[0m`);
  console.log('\nYou can now run:');
  console.log(`  \x1b[33mpnpm run dev:${tenantName}\x1b[0m`);
  console.log(`  \x1b[33mpnpm run build:${tenantName}\x1b[0m\n`);
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', `Failed to create tenant: ${error.message}`);
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  process.exit(1);
}
