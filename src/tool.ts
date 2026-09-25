import { Tool } from "@codeworksh/plugin";
import { searchExa } from "./client.js";
import type { ResolvedExaConfig } from "./config.js";
import { formatError, formatResults } from "./format.js";
import { ExaSearchFailed, ExaSearchParams, ExaSearchSuccess } from "./schemas.js";

export const TOOL_NAME = "exa_search";
export const TOOL_LABEL = "web search";
export const TOOL_PROMPT_SNIPPET = "Search the web using Exa AI neural and keyword search.";
export const TOOL_DESCRIPTION =
  "Search the live web using Exa AI search. Returns high-quality web pages with extracted text highlights.";

export const createExaSearchTool = (config: ResolvedExaConfig) =>
  Tool.make({
    name: TOOL_NAME,
    label: TOOL_LABEL,
    promptSnippet: TOOL_PROMPT_SNIPPET,
    description: TOOL_DESCRIPTION,
    parameters: ExaSearchParams,
    success: ExaSearchSuccess,
    failure: ExaSearchFailed,
    encodeContent: (res) => [{ type: "text", text: formatResults(res) }],
    encodeFailureContent: (fail) => [{ type: "text", text: formatError(fail) }],
    handler: (params) =>
      searchExa({
        apiKey: config.apiKey,
        params,
        defaultNumResults: config.defaultNumResults,
      }),
  });
