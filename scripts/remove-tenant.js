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

const rawTenantName = process.argv[2];

if (!rawTenantName) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Tenant name is required.');
  console.log('\nUsage: pnpm run tenant:remove <tenant-name>');
  console.log('Example: pnpm run tenant:remove tenant-c\n');
  process.exit(1);
}

// Normalize tenant name: allow 'tenant-c' or '@workspace/tenant-c'
const tenantName = rawTenantName
  .replace(/^@workspace\//, '')
  .replace(/^apps\//, '')
  .trim();

// Safeguard protected directories
const protectedDirectories = ['base-template'];
if (protectedDirectories.includes(tenantName.toLowerCase())) {
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

console.log(`\n\x1b[34m▶ Removing tenant: ${tenantName} from ${targetDir}...\x1b[0m`);

try {
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log(`\x1b[32m✔ Removed folder apps/${tenantName}\x1b[0m`);

  // Remove dev and build scripts from root package.json if present
  if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    if (rootPkg.scripts) {
      delete rootPkg.scripts[`dev:${tenantName}`];
      delete rootPkg.scripts[`build:${tenantName}`];
      fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n', 'utf8');
      console.log(`\x1b[32m✔ Cleaned scripts from root package.json\x1b[0m`);
    }
  }

  console.log('\n\x1b[34m▶ Running pnpm install to update workspace lockfile...\x1b[0m');
  execSync('pnpm install', { cwd: rootDir, stdio: 'inherit' });

  console.log('\n\x1b[32m%s\x1b[0m', `✨ Successfully removed tenant: ${tenantName}.`);
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', `Failed to remove tenant: ${error.message}`);
  process.exit(1);
}
