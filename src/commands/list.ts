import { join } from 'path';
import chalk from 'chalk';
import { readDir, statFile, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';

export async function listCommand(cwd = process.cwd()): Promise<void> {
  const plansDir = join(cwd, 'docs', 'features');

  if (!(await pathExists(plansDir))) {
    logger.warn('No docs/features directory found. Run `ctxflow init` first.');
    return;
  }

  const features = await readDir(plansDir);

  if (features.length === 0) {
    logger.info('No features yet. Run `ctxflow new <feature>` to create one.');
    return;
  }

  const rows = await Promise.all(
    features.map(async (name) => {
      const stat = await statFile(join(plansDir, name, 'plan.md'));
      const created = stat ? stat.birthtime.toISOString().split('T')[0] : '—';
      return { name, created };
    })
  );

  console.log('');
  console.log(
    chalk.magenta('  Feature').padEnd(36) +
    chalk.magenta('Created')
  );
  console.log('  ' + chalk.gray('─'.repeat(46)));

  for (const row of rows) {
    console.log(
      chalk.cyan('  ' + row.name).padEnd(38) +
      chalk.gray(row.created)
    );
  }
  console.log('');
  logger.info(`${rows.length} feature${rows.length === 1 ? '' : 's'} found.`);
}
