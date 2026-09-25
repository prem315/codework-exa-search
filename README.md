# codework-tool-exa

Exa AI web search tool plugin for [CodeWork](https://github.com/codeworksh/codework).

It registers the `exa_search` tool, allowing AI agents to perform live neural and keyword web searches and inspect extracted text highlights.

## Installation

Add the plugin to your CodeWork configuration:

```jsonc
// .codework/settings.jsonc or ~/.codework/settings.jsonc
{
  "plugins": [
    "codework-tool-exa",
    {
      "package": "codework-tool-exa",
      "options": {
        "apiKey": "your-exa-api-key",
        "defaultNumResults": 5
      }
    }
  ]
}
```

Alternatively, you can provide the API key through the `EXA_API_KEY` environment variable.

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | `process.env.EXA_API_KEY` | Your Exa AI API key. |
| `defaultNumResults` | `number` | `5` | Default number of search results to return (clamped between 1 and 20). |

## Tool: `exa_search`

Searches the web via Exa AI.

### Parameters

- `query` (string, required): The search query to look up on the web.
- `numResults` (number, optional): Number of results to return (1-20).
- `type` (`"auto"` | `"neural"` | `"keyword"`, optional): Type of search to perform.
- `includeDomains` (string[], optional): Restrict search to specific domains.
- `excludeDomains` (string[], optional): Exclude specific domains from search.

## Project Structure

This project follows modular TypeScript and Effect best practices:

- `src/constants.ts`: System defaults, limits, and endpoint constants.
- `src/schemas.ts`: Parameter, success, and error schemas using `@codeworksh/plugin` and `effect`.
- `src/config.ts`: Configuration parsing, environment resolution, and bounds clamping.
- `src/client.ts`: Exa AI HTTP client encapsulating requests, headers, and error handling.
- `src/format.ts`: Pure presentation functions to format search results for AI models.
- `src/tool.ts`: CodeWork tool definition and registration logic.
- `src/index.ts`: Plugin entry point and public exports.
