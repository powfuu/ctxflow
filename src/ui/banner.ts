import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

const PURPLE_CYAN = ['#9B59B6', '#7C3AED', '#2563EB', '#06B6D4'];

export function showBanner(): void {
  let art: string;
  try {
    art = figlet.textSync('CTXFLOW', { font: 'ANSI Shadow' });
  } catch {
    art = figlet.textSync('CTXFLOW', { font: 'Big' });
  }

  const g = gradient(PURPLE_CYAN);
  const sep = gradient(['#9B59B6', '#06B6D4'])('─'.repeat(60));

  console.log('');
  console.log(g.multiline(art));
  console.log(chalk.cyan('  Context Scaffolding for AI Agent Development'));
  console.log(chalk.gray(`  v${version}`));
  console.log(`  ${sep}`);
  console.log('');
}
