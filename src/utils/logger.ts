import chalk from 'chalk';

export const logger = {
  success: (msg: string) => console.log(chalk.green('✓') + ' ' + chalk.white(msg)),
  error:   (msg: string) => console.log(chalk.red('✗') + ' ' + chalk.red(msg)),
  warn:    (msg: string) => console.log(chalk.yellow('⚠') + ' ' + chalk.yellow(msg)),
  info:    (msg: string) => console.log(chalk.cyan('ℹ') + ' ' + chalk.white(msg)),
  file:    (path: string) => console.log(chalk.magenta('  →') + ' ' + chalk.gray(path)),
  blank:   () => console.log(''),
};
