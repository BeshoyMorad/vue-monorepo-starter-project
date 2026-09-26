#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.resolve(rootDir, 'apps');
const baseTemplateDir = path.resolve(appsDir, 'base-template');
const rootPkgPath = path.resolve(rootDir, 'package.json');

const rawTenantName = process.argv[2];

if (!rawTenantName) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Tenant name is required.');
  console.log('\nUsage: pnpm run tenant:add <tenant-name>');
  console.log('Example: pnpm run tenant:add tenant-c\n');
  process.exit(1);
}

// Normalize tenant name: allow 'tenant-c' or '@workspace/tenant-c'
const tenantName = rawTenantName
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

const targetDir = path.resolve(appsDir, tenantName);

if (!fs.existsSync(baseTemplateDir)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: Base template not found at ${baseTemplateDir}`);
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: Tenant folder already exists at apps/${tenantName}`);
  process.exit(1);
}

console.log(`\n\x1b[34m▶ Creating new tenant: ${tenantName}...\x1b[0m`);

// Copy base-template to new tenant folder (skipping transient files)
const filterFunc = (src) => {
  const base = path.basename(src);
  return !['node_modules', 'dist', '.turbo', '.DS_Store'].includes(base);
};

try {
  fs.cpSync(baseTemplateDir, targetDir, { recursive: true, filter: filterFunc });
  console.log(`\x1b[32m✔ Scaffolding copied from apps/base-template to apps/${tenantName}\x1b[0m`);

  // Update package.json in target tenant
  const targetPkgPath = path.resolve(targetDir, 'package.json');
  if (fs.existsSync(targetPkgPath)) {
    const pkgContent = JSON.parse(fs.readFileSync(targetPkgPath, 'utf8'));
    pkgContent.name = `@workspace/${tenantName}`;
    pkgContent.dependencies = pkgContent.dependencies || {};
    pkgContent.dependencies['@workspace/core'] = 'workspace:*';
    pkgContent.dependencies['@workspace/ui'] = 'workspace:*';
    fs.writeFileSync(targetPkgPath, JSON.stringify(pkgContent, null, 2) + '\n', 'utf8');
    console.log(`\x1b[32m✔ Updated package.json name to @workspace/${tenantName}\x1b[0m`);
  }

  // Update root package.json scripts with dev and build commands for new tenant
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

  // Run pnpm install to link dependencies in workspace
  console.log('\n\x1b[34m▶ Running pnpm install to register new workspace package...\x1b[0m');
  execSync('pnpm install', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[32m%s\x1b[0m', `✨ Successfully created tenant: ${tenantName}!`);
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
