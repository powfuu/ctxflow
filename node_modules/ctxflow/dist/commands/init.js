import { join } from 'path';
import chalk from 'chalk';
import { readTemplate, renderTemplate, writeFile, pathExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { AGENTS } from '../utils/agents.js';
const TODAY = new Date().toISOString().split('T')[0];
async function pickAgents() {
    const items = AGENTS.map(a => a.label);
    let cursor = 0;
    const selected = new Set([0]); // Claude Code pre-selected
    let firstRender = true;
    function render() {
        const HEADER = 3;
        const FOOTER = 2;
        const totalLines = HEADER + items.length + FOOTER;
        if (!firstRender) {
            process.stdout.write(`\x1b[${totalLines}A`);
        }
        firstRender = false;
        process.stdout.write('\n');
        process.stdout.write(`  ${chalk.cyan('Which AI agents do you use?')}  ` +
            `${chalk.gray('Space = toggle  ·  ↑↓ or j/k = navigate  ·  a = all  ·  Enter = confirm')}\n`);
        process.stdout.write('\n');
        for (let i = 0; i < items.length; i++) {
            const cur = i === cursor ? chalk.cyan('❯') : ' ';
            const box = selected.has(i) ? chalk.magenta('◉') : chalk.gray('◯');
            const lbl = i === cursor ? chalk.white(items[i]) : chalk.gray(items[i]);
            process.stdout.write(`  ${cur} ${box} ${lbl}\x1b[K\n`);
        }
        process.stdout.write('\n');
        process.stdout.write(`  ${chalk.gray('Esc to cancel')}\n`);
    }
    render();
    return new Promise((resolve) => {
        const stdin = process.stdin;
        if (!stdin.isTTY) {
            resolve([0]);
            return;
        }
        stdin.setRawMode(true);
        stdin.resume();
        const cleanup = () => {
            stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener('data', onData);
            process.stdout.write('\n');
        };
        const onData = (chunk) => {
            const key = chunk.toString();
            if (key === '\x03') {
                cleanup();
                process.exit(0);
            }
            if (key === '\x1b') {
                cleanup();
                resolve(null);
                return;
            }
            if (key === '\x1b[A' || key === 'k') {
                cursor = (cursor - 1 + items.length) % items.length;
                render();
                return;
            }
            if (key === '\x1b[B' || key === 'j') {
                cursor = (cursor + 1) % items.length;
                render();
                return;
            }
            if (key === ' ') {
                if (selected.has(cursor))
                    selected.delete(cursor);
                else
                    selected.add(cursor);
                render();
                return;
            }
            if (key === 'a' || key === 'A') {
                if (selected.size === items.length)
                    selected.clear();
                else
                    items.forEach((_, i) => selected.add(i));
                render();
                return;
            }
            if (key === '\r' || key === '\n') {
                if (selected.size === 0)
                    return;
                cleanup();
                resolve([...selected].sort((a, b) => a - b));
            }
        };
        stdin.on('data', onData);
    });
}
async function confirmOverwrite(_files) {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        process.stdout.write(`\n  ${chalk.yellow('Project already initialised.')} ${chalk.white('Overwrite?')}` +
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
                process.exit(0);
            if (key === '\x1b') {
                resolve(false);
                return;
            }
            if (key === '\r' || key === '\n') {
                resolve(true);
                return;
            }
            if (key.toLowerCase() === 'y') {
                resolve(true);
                return;
            }
            resolve(false);
        });
    });
}
export async function initCommand(cwd = process.cwd()) {
    const indices = await pickAgents();
    if (indices === null) {
        console.log('');
        logger.warn('Aborted — nothing changed.');
        return false;
    }
    // Deduplicate by file path (codex + others both map to AGENTS.md → one file)
    const seen = new Map();
    for (const i of indices) {
        const agent = AGENTS[i];
        if (!seen.has(agent.file))
            seen.set(agent.file, agent);
    }
    const toCreate = [...seen.values()];
    const existing = [];
    for (const agent of toCreate) {
        if (await pathExists(join(cwd, agent.file)))
            existing.push(agent.file);
    }
    if (existing.length > 0) {
        const yes = await confirmOverwrite(existing);
        if (!yes) {
            console.log('');
            logger.warn('Aborted — nothing changed.');
            return false;
        }
    }
    console.log('');
    const tpl = await readTemplate('context.md.hbs');
    for (const agent of toCreate) {
        const vars = { agentName: agent.agentName, contextFile: agent.file, date: TODAY };
        await writeFile(join(cwd, agent.file), renderTemplate(tpl, vars));
        logger.file(agent.file);
    }
    console.log('');
    logger.success('Project initialised!');
    logger.blank();
    logger.info('Fill in your stack, architecture, and approvals in the context file(s) above.');
    return true;
}
//# sourceMappingURL=init.js.map