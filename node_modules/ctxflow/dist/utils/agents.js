import { join } from 'path';
import { pathExists } from './fs.js';
export const AGENTS = [
    { id: 'claude', label: 'Claude Code', file: 'CLAUDE.md', agentName: 'CLAUDE.md' },
    { id: 'codex', label: 'Codex CLI (OpenAI)', file: 'AGENTS.md', agentName: 'AGENTS.md' },
    { id: 'cursor', label: 'Cursor', file: '.cursor/rules/project.md', agentName: 'Cursor Rules' },
    { id: 'copilot', label: 'GitHub Copilot', file: '.github/copilot-instructions.md', agentName: 'GitHub Copilot' },
    { id: 'windsurf', label: 'Windsurf', file: '.windsurfrules', agentName: 'Windsurf' },
    { id: 'gemini', label: 'Gemini CLI', file: 'GEMINI.md', agentName: 'GEMINI.md' },
    { id: 'cline', label: 'Cline', file: '.clinerules', agentName: 'Cline' },
    { id: 'aider', label: 'Aider', file: 'CONVENTIONS.md', agentName: 'CONVENTIONS.md' },
    { id: 'amazonq', label: 'Amazon Q', file: '.amazonq/rules/context.md', agentName: 'Amazon Q' },
    { id: 'continue', label: 'Continue', file: '.continuerules', agentName: 'Continue' },
    { id: 'others', label: 'Devin / Kiro / others', file: 'AGENTS.md', agentName: 'AGENTS.md' },
];
export const ALL_CONTEXT_FILES = [...new Set(AGENTS.map(a => a.file))];
export async function isProjectInitialised(cwd) {
    const checks = await Promise.all(ALL_CONTEXT_FILES.map(f => pathExists(join(cwd, f))));
    return checks.some(Boolean);
}
//# sourceMappingURL=agents.js.map