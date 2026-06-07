import pkg from 'fs-extra';
const { copySync } = pkg;
copySync('src/templates', 'dist/templates', { overwrite: true });
console.log('✓ Templates copied → dist/templates/');
