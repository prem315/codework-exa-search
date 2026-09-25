export interface ExaPluginOptions {
    readonly apiKey?: string;
    readonly defaultNumResults?: number;
}
export interface ResolvedExaConfig {
    readonly apiKey: string | undefined;
    readonly defaultNumResults: number;
}
/**
 * Safely parse and normalize options provided to the Exa plugin.
 * Falls back to process.env.EXA_API_KEY if apiKey is not explicitly passed.
 */
export declare const resolveConfig: (options?: Record<string, unknown>) => ResolvedExaConfig;
//# sourceMappingURL=config.d.ts.map