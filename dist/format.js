import { TEXT_PREVIEW_CHARACTERS } from "./constants.js";
/**
 * Format search results into Markdown text for AI consumption.
 */
export const formatResults = (success) => {
    if (success.results.length === 0) {
        return `No results found for query: "${success.query}"`;
    }
    return success.results
        .map((r, i) => {
        const lines = [`${i + 1}. [${r.title ?? "Untitled"}](${r.url})`];
        if (r.publishedDate)
            lines.push(`   Published: ${r.publishedDate}`);
        if (r.author)
            lines.push(`   Author: ${r.author}`);
        if (r.highlights && r.highlights.length > 0) {
            lines.push(`   Highlights:\n${r.highlights.map((h) => `   > ${h}`).join("\n")}`);
        }
        else if (r.text) {
            const preview = r.text.slice(0, TEXT_PREVIEW_CHARACTERS);
            lines.push(`   Content: ${preview}${r.text.length > TEXT_PREVIEW_CHARACTERS ? "..." : ""}`);
        }
        return lines.join("\n");
    })
        .join("\n\n");
};
/**
 * Format error messages into displayable text for the AI.
 */
export const formatError = (failure) => {
    return `Search failed: ${failure.message}`;
};
//# sourceMappingURL=format.js.map