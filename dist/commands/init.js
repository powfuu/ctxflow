import { join } from 'path';
import chalk from 'chalk';
import { readTemplate, renderTemplate, writeFile, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
const TODAY = new Date().toISOString().split('T')[0];
async function confirmOverwrite() {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        process.stdout.write(`  ${chalk.yellow('CLAUDE.md already exists.')} ${chalk.white('Overwrite?')}` +
            chalk.gray('  Enter = yes  /  Esc = no  '));
        if (!stdin.isTTY) {
            stdin.once('data', (c) => resolve(c.toString().trim().toLowerCase() === 'y'));
            return;
        }
        stdin.setRawMode(true);
        stdin.resume();
        stdin.once('data', (chunk) => {
            stdin.setRawMode(false);
            stdin.pause();
            const key = chunk.toString();
            process.stdout.write('\n');
            if (key === '\x03')
                process.exit(0); // Ctrl+C → exit
            if (key === '\x1b') {
                resolve(false);
                return;
            } // Esc → no
            if (key === '\r' || key === '\n') {
                resolve(true);
                return;
            } // Enter → yes
            if (key.toLowerCase() === 'y') {
                resolve(true);
                return;
            }
            resolve(false); // anything else → no
        });
    });
}
// Returns true = completed, false = aborted (Esc / no)
export async function initCommand(cwd = process.cwd()) {
    const claudePath = join(cwd, 'CLAUDE.md');
    if (await pathExists(claudePath)) {
        const yes = await confirmOverwrite();
        if (!yes) {
            console.log('');
            logger.warn('Aborted — nothing changed.');
            return false;
        }
    }
    const vars = { date: TODAY };
    const claudeTpl = await readTemplate('CLAUDE.md.hbs');
    await writeFile(claudePath, renderTemplate(claudeTpl, vars));
    logger.success('Project initialised!');
    logger.blank();
    logger.file('CLAUDE.md');
    logger.blank();
    logger.info('Edit CLAUDE.md to fill in your stack, architecture, and approvals.');
    return true;
}
//# sourceMappingURL=init.js.map