import type { ExaSearchFailed, ExaSearchSuccess } from "./schemas.js";
/**
 * Format search results into Markdown text for AI consumption.
 */
export declare const formatResults: (success: ExaSearchSuccess) => string;
/**
 * Format error messages into displayable text for the AI.
 */
export declare const formatError: (failure: ExaSearchFailed) => string;
//# sourceMappingURL=format.d.ts.map