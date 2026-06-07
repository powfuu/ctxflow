import { join } from 'path';
import chalk from 'chalk';
import { pathExists, readFileContent } from '../utils/fs.js';
import { logger } from '../utils/logger.js';

interface Task {
  done: boolean;
  text: string;
}

function parseTasks(content: string): Task[] {
  const tasks: Task[] = [];
  const pattern = /^- \[([xX ])\] (.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    tasks.push({ done: match[1].toLowerCase() === 'x', text: match[2] });
  }
  return tasks;
}

export async function statusCommand(featureName: string, cwd = process.cwd()): Promise<void> {
  const planPath = join(cwd, 'docs', 'features', featureName, 'plan.md');

  if (!(await pathExists(planPath))) {
    logger.error(`Feature "${featureName}" not found at docs/features/${featureName}/plan.md`);
    return;
  }

  const content = await readFileContent(planPath);
  const tasks   = parseTasks(content);

  if (tasks.length === 0) {
    logger.warn('No tasks found in plan.md (no `- [ ]` or `- [x]` lines).');
    return;
  }

  const done    = tasks.filter(t => t.done).length;
  const total   = tasks.length;
  const percent = Math.round((done / total) * 100);
  const bar     = buildBar(done, total);

  console.log('');
  console.log(chalk.cyan(`  ${featureName}`));
  console.log(`  ${bar}  ${chalk.white(`${done}/${total}`)} ${chalk.gray(`(${percent}%)`)}`);
  console.log('');

  for (const task of tasks) {
    const icon  = task.done ? chalk.green('✅') : chalk.gray('⬜');
    const label = task.done ? chalk.gray(task.text) : chalk.white(task.text);
    console.log(`  ${icon}  ${label}`);
  }
  console.log('');
}

function buildBar(done: number, total: number, width = 20): string {
  const filled = Math.round((done / total) * width);
  const empty  = width - filled;
  return chalk.cyan('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}
