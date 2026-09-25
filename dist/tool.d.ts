import { Tool } from "@codeworksh/plugin";
import type { ResolvedExaConfig } from "./config.js";
import { ExaSearchFailed } from "./schemas.js";
export declare const TOOL_NAME = "exa_search";
export declare const TOOL_LABEL = "web search";
export declare const TOOL_PROMPT_SNIPPET = "Search the web using Exa AI neural and keyword search.";
export declare const TOOL_DESCRIPTION = "Search the live web using Exa AI search. Returns high-quality web pages with extracted text highlights.";
export declare const createExaSearchTool: (config: ResolvedExaConfig) => Tool.ToolImpl<"exa_search", import("effect/Schema").Struct<{
    readonly query: import("effect/Schema").String;
    readonly numResults: import("effect/Schema").optional<import("effect/Schema").Number>;
    readonly type: import("effect/Schema").optional<import("effect/Schema").Literals<readonly ["auto", "fast", "instant", "deep"]>>;
    readonly includeDomains: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").String>>;
    readonly excludeDomains: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").String>>;
}>, import("effect/Schema").Struct<{
    readonly query: import("effect/Schema").String;
    readonly results: import("effect/Schema").$Array<import("effect/Schema").Struct<{
        readonly title: import("effect/Schema").NullOr<import("effect/Schema").String>;
        readonly url: import("effect/Schema").String;
        readonly publishedDate: import("effect/Schema").NullOr<import("effect/Schema").String>;
        readonly author: import("effect/Schema").NullOr<import("effect/Schema").String>;
        readonly text: import("effect/Schema").optional<import("effect/Schema").String>;
        readonly highlights: import("effect/Schema").optional<import("effect/Schema").$Array<import("effect/Schema").String>>;
    }>>;
}>, typeof ExaSearchFailed, never>;
//# sourceMappingURL=tool.d.ts.map