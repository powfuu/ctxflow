export declare const TEMPLATES_DIR: string;
export declare function renderTemplate(template: string, vars: Record<string, string>): string;
export declare function readTemplate(name: string): Promise<string>;
export declare function writeFile(filePath: string, content: string): Promise<void>;
export declare function pathExists(filePath: string): Promise<boolean>;
export declare function readDir(dirPath: string): Promise<string[]>;
export declare function readFileContent(filePath: string): Promise<string>;
export declare function statFile(filePath: string): Promise<{
    birthtime: Date;
} | null>;
//# sourceMappingURL=fs.d.ts.map