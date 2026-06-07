import { Command, CommanderError } from 'commander';
import { showBanner } from './ui/banner.js';
import { showMenu, showHelp } from './ui/menu.js';
import { initCommand }   from './commands/init.js';
import { newCommand }    from './commands/new.js';
import { listCommand }   from './commands/list.js';
import { statusCommand } from './commands/status.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('ctxflow')
  .description('Context scaffolding for AI agent-driven development')
  .version('1.0.0')
  .exitOverride()
  .configureOutput({ outputError: () => {} }); // suppress commander's raw error lines

program
  .command('init')
  .description('Select AI agents and create context file(s) in the current project')
  .action(async () => {
    showBanner();
    await initCommand();
  });

program
  .command('new <feature>')
  .description('Scaffold docs/plans/<feature>/ with requirements, plan, and decisions files')
  .action(async (feature: string) => {
    showBanner();
    await newCommand(feature);
  });

program
  .command('list')
  .description('List all feature plans in docs/plans/')
  .action(async () => {
    showBanner();
    await listCommand();
  });

program
  .command('status <feature>')
  .description('Show task completion status for a feature plan')
  .action(async (feature: string) => {
    showBanner();
    await statusCommand(feature);
  });

// Unknown command (no dash) → show help
program.on('command:*', () => {
  showBanner();
  showHelp();
  process.exit(1);
});

if (process.argv.length <= 2) {
  showMenu().catch((err: unknown) => {
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
} else {
  program.parseAsync(process.argv).catch((err: unknown) => {
    if (err instanceof CommanderError) {
      // --version / --help already printed their output cleanly
      if (err.exitCode === 0) process.exit(0);
      // Unknown option (dashes) → show help
      showBanner();
      showHelp();
      process.exit(1);
    }
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
