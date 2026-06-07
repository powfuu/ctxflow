import chalk from 'chalk';
export const logger = {
    success: (msg) => console.log(chalk.green('✓') + ' ' + chalk.white(msg)),
    error: (msg) => console.log(chalk.red('✗') + ' ' + chalk.red(msg)),
    warn: (msg) => console.log(chalk.yellow('⚠') + ' ' + chalk.yellow(msg)),
    info: (msg) => console.log(chalk.cyan('ℹ') + ' ' + chalk.white(msg)),
    file: (path) => console.log(chalk.magenta('  →') + ' ' + chalk.gray(path)),
    blank: () => console.log(''),
};
//# sourceMappingURL=logger.js.map