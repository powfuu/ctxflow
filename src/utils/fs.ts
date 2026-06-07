import fsExtra from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const TEMPLATES_DIR = join(__dirname, '..', 'templates');

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export async function readTemplate(name: string): Promise<string> {
  return fsExtra.readFile(join(TEMPLATES_DIR, name), 'utf-8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fsExtra.ensureDir(dirname(filePath));
  await fsExtra.writeFile(filePath, content, 'utf-8');
}

export async function pathExists(filePath: string): Promise<boolean> {
  return fsExtra.pathExists(filePath);
}

export async function readDir(dirPath: string): Promise<string[]> {
  try {
    const entries = await fsExtra.readdir(dirPath, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name);
  } catch {
    return [];
  }
}

export async function readFileContent(filePath: string): Promise<string> {
  return fsExtra.readFile(filePath, 'utf-8');
}

export async function statFile(filePath: string): Promise<{ birthtime: Date } | null> {
  try {
    return await fsExtra.stat(filePath);
  } catch {
    return null;
  }
}
