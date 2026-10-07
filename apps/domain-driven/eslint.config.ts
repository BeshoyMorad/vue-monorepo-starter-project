import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import workspaceConfig from '@workspace/eslint-config';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const domainsDir = path.resolve(currentDir, 'src/domains');

const domains: string[] = fs.existsSync(domainsDir)
  ? fs
      .readdirSync(domainsDir, { withFileTypes: true })
      .filter((d: fs.Dirent) => d.isDirectory())
      .map((d: fs.Dirent) => d.name)
  : [];

const domainIsolationConfigs = domains.map((domain: string) => {
  const otherDomains = domains.filter((d: string) => d !== domain);
  return {
    files: [`src/domains/${domain}/**/*.{ts,vue}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                ...otherDomains.flatMap((other: string) => [
                  `@/domains/${other}/**`,
                  `@/domains/${other}`,
                  `@domains/${other}/**`,
                  `@domains/${other}`,
                  `../${other}/**`,
                  `../../${other}/**`,
                  `../../../${other}/**`,
                ]),
              ],
              message: `Domain '${domain}' is strictly isolated and cannot import from sibling domain(s): ${otherDomains.join(', ')}.`,
            },
          ],
        },
      ],
    },
  };
});

export default [
  ...workspaceConfig,
  // Architecture Boundary: Cross-domain isolation rules
  ...domainIsolationConfigs,
];
