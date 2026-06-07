import chalk from 'chalk';
import { showBanner } from './banner.js';
import { initCommand }   from '../commands/init.js';
import { newCommand }    from '../commands/new.js';
import { listCommand }   from '../commands/list.js';
import { statusCommand } from '../commands/status.js';
import { readDir } from '../utils/fs.js';
import { isProjectInitialised } from '../utils/agents.js';
import { join } from 'path';

type MenuAction = 'new' | 'init' | 'list' | 'status' | 'help';

interface Choice<T> {
  key: string;
  label: string;
  desc: string;
  value: T;
}

const MAIN_CHOICES: Choice<MenuAction>[] = [
  { key: '1', label: 'New feature',   desc: '— scaffold a new feature context',    value: 'new'    },
  { key: '2', label: 'Init project',  desc: '— create AI context file(s) + /docs structure', value: 'init'   },
  { key: '3', label: 'List features', desc: '— show all existing plans',            value: 'list'   },
  { key: '4', label: 'Status',        desc: '— check tasks in a feature plan',      value: 'status' },
  { key: '5', label: 'Help',          desc: '— show usage and documentation',       value: 'help'   },
];

// ─── raw input primitives ────────────────────────────────────────────────────

async function pressKey(): Promise<string> {
  return new Promise<string>((resolve) => {
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      stdin.once('data', (c) => resolve(c.toString().trim()[0] ?? ''));
      return;
    }
    stdin.setRawMode(true);
    stdin.resume();
    stdin.once('data', (chunk) => {
      const key = chunk.toString();
      stdin.setRawMode(false);
      stdin.pause();
      if (key === '\x03') process.exit(0); // Ctrl+C always exits
      resolve(key);
    });
  });
}

// Custom text input: Esc → null, Ctrl+C → exit, Enter (non-empty) → string
async function readLine(prompt: string): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const stdin = process.stdin;
    let buf = '';

    process.stdout.write(prompt);

    if (!stdin.isTTY) {
      stdin.once('data', (c) => {
        const t = c.toString().split('\n')[0]?.trim() ?? '';
        resolve(t.length > 0 ? t : null);
      });
      return;
    }

    stdin.setRawMode(true);
    stdin.resume();

    const cleanup = (): void => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
    };

    const onData = (chunk: Buffer): void => {
      const key = chunk.toString();

      if (key === '\x03') {                  // Ctrl+C → exit
        cleanup(); process.stdout.write('\n'); process.exit(0);
      }
      if (key === '\x1b') {                  // Esc → go back
        cleanup(); process.stdout.write('\n'); resolve(null); return;
      }
      if (key.startsWith('\x1b')) return;    // arrow keys / other sequences → ignore

      if (key === '\r' || key === '\n') {    // Enter
        if (buf.trim().length === 0) return; // empty → do nothing
        cleanup(); process.stdout.write('\n'); resolve(buf.trim()); return;
      }
      if (key === '\x7f' || key === '\b') {  // Backspace
        if (buf.length > 0) { buf = buf.slice(0, -1); process.stdout.write('\b \b'); }
        return;
      }
      if (key.charCodeAt(0) >= 32) {         // printable char
        buf += key; process.stdout.write(key);
      }
    };

    stdin.on('data', onData);
  });
}

// ─── menu rendering ──────────────────────────────────────────────────────────

function renderChoices<T>(
  message: string,
  choices: Choice<T>[],
  hint?: string,
): void {
  console.log(chalk.cyan(`  ${message}\n`));
  for (const c of choices) {
    const k = chalk.magenta(`[${c.key}]`);
    const l = chalk.white(c.label.padEnd(16));
    const d = chalk.gray(c.desc);
    console.log(`  ${k}  ${l}${d}`);
  }
  if (hint) console.log(`\n  ${chalk.gray(hint)}`);
  console.log('');
}

interface PickOpts {
  hint?: string;
  escBack?: boolean; // true → Esc returns null; false → Esc ignored (main menu)
}

async function pickFromList<T>(
  message: string,
  choices: Choice<T>[],
  opts: PickOpts = {},
): Promise<T | null> {
  const valid = new Set(choices.map(c => c.key));
  renderChoices(message, choices, opts.hint);
  while (true) {
    const key = await pressKey();
    if (key === '\x1b') {
      if (opts.escBack) { console.log(''); return null; }
      continue; // main menu: ignore Esc
    }
    if (!valid.has(key)) continue;
    const choice = choices.find(c => c.key === key) as Choice<T>;
    console.log(chalk.gray(`  ${choice.label}`));
    console.log('');
    return choice.value;
  }
}

// ─── public menu loop ────────────────────────────────────────────────────────

async function pressAnyKey(): Promise<void> {
  console.log(chalk.gray('\n  Press any key to return to menu...'));
  await pressKey();
}

export async function showMenu(): Promise<void> {
  let needsWait = false;
  while (true) {
    if (needsWait) await pressAnyKey();

    showBanner();
    const action = await pickFromList(
      'What would you like to do?',
      MAIN_CHOICES,
      { hint: 'Ctrl+C to exit' },
    );

    if (action === null) { needsWait = false; continue; }

    console.log('');
    let result: 'done' | 'back' = 'done';
    switch (action) {
      case 'new':    result = await handleNew(); break;
      case 'init':   result = await handleInit(); break;
      case 'list':   await listCommand(); break;
      case 'status': result = await handleStatus(); break;
      case 'help':   showHelp(); break;
    }
    needsWait = result === 'done';
  }
}

// ─── sub-flows ───────────────────────────────────────────────────────────────

async function handleNew(): Promise<'done' | 'back'> {
  const name = await readLine(
    `  ${chalk.cyan('?')} ${chalk.white('Feature name')}  ${chalk.gray('(Esc to go back)')}  `,
  );
  if (name === null) return 'back'; // Esc → skip wait, re-render immediately
  console.log('');
  await newCommand(name);
  return 'done';
}

async function handleInit(): Promise<'done' | 'back'> {
  const completed = await initCommand();
  return completed ? 'done' : 'back';
}

async function handleStatus(): Promise<'done' | 'back'> {
  const cwd         = process.cwd();
  const featuresDir = join(cwd, 'docs', 'features');

  if (!(await isProjectInitialised(cwd))) {
    console.log(chalk.yellow('  ⚠ ctxflow not initialised here. Run `ctxflow init` first.'));
    return 'done';
  }

  const features = await readDir(featuresDir);

  if (features.length === 0) {
    console.log(chalk.green('  ✓ ctxflow is active.') + chalk.gray('  No features added yet.'));
    console.log(chalk.gray('    Run `ctxflow new <feature>` to create your first one.'));
    return 'done';
  }

  console.log(
    chalk.green('  ✓ ctxflow is active.') +
    chalk.gray(`  ${features.length} feature${features.length === 1 ? '' : 's'} found.\n`),
  );

  const KEYS = ['1','2','3','4','5','6','7','8','9'];
  const slice = features.slice(0, 9);

  if (features.length > 9) {
    console.log(chalk.cyan('  ℹ Showing first 9. Use `ctxflow status <name>` for the rest.\n'));
  }

  const choices: Choice<string>[] = slice.map((f, i) => ({
    key: KEYS[i] as string,
    label: f,
    desc: '',
    value: f,
  }));

  const feature = await pickFromList('Which feature?', choices, { escBack: true });
  if (!feature) return 'back'; // Esc → skip wait

  await statusCommand(feature);
  return 'done';
}

export function showHelp(): void {
  console.log(chalk.cyan('  Usage'));
  console.log('');
  console.log(`  ${chalk.magenta('ctxflow')}                     ${chalk.gray('→ show interactive menu')}`);
  console.log(`  ${chalk.magenta('ctxflow init')}                ${chalk.gray('→ select AI agents and create context file(s)')}`);
  console.log(`  ${chalk.magenta('ctxflow new')} ${chalk.cyan('<feature>')}    ${chalk.gray('→ scaffold docs/features/<feature>/')}`);
  console.log(`  ${chalk.magenta('ctxflow list')}                ${chalk.gray('→ list all features')}`);
  console.log(`  ${chalk.magenta('ctxflow status')} ${chalk.cyan('<feature>')} ${chalk.gray('→ show task progress for a feature')}`);
  console.log('');
  console.log('');
}
