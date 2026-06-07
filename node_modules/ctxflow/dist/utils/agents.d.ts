export interface AgentConfig {
    id: string;
    label: string;
    file: string;
    agentName: string;
}
export declare const AGENTS: AgentConfig[];
export declare const ALL_CONTEXT_FILES: string[];
export declare function isProjectInitialised(cwd: string): Promise<boolean>;
//# sourceMappingURL=agents.d.ts.map