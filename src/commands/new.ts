import { join } from 'path';
import { readTemplate, renderTemplate, writeFile, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { isProjectInitialised } from '../utils/agents.js';

const TODAY = new Date().toISOString().split('T')[0];

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function newCommand(featureName: string, cwd = process.cwd()): Promise<void> {
  if (!(await isProjectInitialised(cwd))) {
    logger.error('Project not initialised. Run `ctxflow init` first.');
    return;
  }

  const slug = slugify(featureName);
  if (!slug) {
    logger.error('Invalid feature name.');
    return;
  }

  const dir = join(cwd, 'docs', 'features', slug);

  if (await pathExists(dir)) {
    logger.warn(`Feature "${slug}" already exists at docs/features/${slug}`);
    logger.info('Edit the existing files or choose a different name.');
    return;
  }

  const vars = { feature: featureName.trim(), date: TODAY };

  const [reqTpl, planTpl] = await Promise.all([
    readTemplate('requirements.md.hbs'),
    readTemplate('plan.md.hbs'),
  ]);

  await Promise.all([
    writeFile(join(dir, 'requirements.md'), renderTemplate(reqTpl,  vars)),
    writeFile(join(dir, 'plan.md'),         renderTemplate(planTpl, vars)),
  ]);

  logger.success(`Feature "${featureName.trim()}" created!`);
  logger.blank();
  logger.file(`docs/features/${slug}/requirements.md`);
  logger.file(`docs/features/${slug}/plan.md`);
  logger.blank();
  logger.info('Start by filling in requirements.md before writing any code.');
}
