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

// Core templates and protected directories that cannot be removed
const PROTECTED_DIRECTORIES = ['base-template', 'website'];

function printHelp() {
  console.log(`
\x1b[1m\x1b[34mTenant Removal Tool\x1b[0m

\x1b[1mUsage:\x1b[0m
  pnpm run tenant:remove <tenant-name>
  pnpm run tenant:remove --name=<tenant-name>

\x1b[1mProtected Core Directories (Cannot be removed):\x1b[0m
  • \x1b[33mbase-template\x1b[0m : Vite SPA dashboard base template
  • \x1b[33mwebsite\x1b[0m       : Nuxt 3 SSR website template

\x1b[1mExamples:\x1b[0m
  pnpm run tenant:remove tenant-c
  pnpm run tenant:remove @workspace/tenant-c
`);
}

function parseArgs(args) {
  let tenantName = null;
  let help = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      help = true;
      break;
    }
    if (arg.startsWith('--name=')) {
      tenantName = arg.split('=')[1];
    } else if (arg === '--name' || arg === '-n') {
      tenantName = args[++i];
    } else if (!arg.startsWith('-') && !tenantName) {
      tenantName = arg;
    }
  }

  return { tenantName, help };
}

const { tenantName: rawTenantName, help } = parseArgs(process.argv.slice(2));

if (help) {
  printHelp();
  process.exit(0);
}

if (!rawTenantName) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Tenant name is required.');
  printHelp();
  process.exit(1);
}

// Normalize tenant name: allow 'tenant-c', '@workspace/tenant-c', or 'apps/tenant-c'
const tenantName = rawTenantName
  .replace(/^@workspace\//, '')
  .replace(/^apps\//, '')
  .trim();

// Safeguard protected directories
if (PROTECTED_DIRECTORIES.includes(tenantName.toLowerCase())) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Error: Cannot remove protected core directory "${tenantName}". Action aborted.`
  );
  process.exit(1);
}

const targetDir = path.resolve(appsDir, tenantName);

// Security check: ensure target is strictly inside appsDir
if (!targetDir.startsWith(appsDir + path.sep)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: Invalid directory path.`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: Tenant folder not found at apps/${tenantName}`);
  process.exit(1);
}

console.log(`\n\x1b[34m▶ Removing tenant: \x1b[1m${tenantName}\x1b[0m from ${targetDir}...\x1b[0m`);

try {
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log(`\x1b[32m✔ Removed folder apps/${tenantName}\x1b[0m`);

  // Remove scripts from root package.json if present
  if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    if (rootPkg.scripts) {
      let cleaned = false;
      const scriptKeysToRemove = [
        `dev:${tenantName}`,
        `build:${tenantName}`,
        `preview:${tenantName}`,
      ];

      for (const key of scriptKeysToRemove) {
        if (rootPkg.scripts[key]) {
          delete rootPkg.scripts[key];
          cleaned = true;
        }
      }

      if (cleaned) {
        fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n', 'utf8');
        console.log(`\x1b[32m✔ Cleaned scripts from root package.json\x1b[0m`);
      }
    }
  }

  console.log('\n\x1b[34m▶ Running pnpm install to update workspace lockfile...\x1b[0m');
  execSync('pnpm install', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[32m%s\x1b[0m', `✨ Successfully removed tenant: ${tenantName}.`);
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', `Failed to remove tenant: ${error.message}`);
  process.exit(1);
}
