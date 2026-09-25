# codework-exa-search

Exa AI web search tool plugin for [CodeWork](https://github.com/codeworksh/codework).

It registers the `exa_search` tool (plugin ID `exa.tool.search`), letting agents search the live web and read extracted text highlights.

## Installation

```sh
codework plugin add codework-exa-search          # this project (.codework/settings.jsonc)
codework plugin add codework-exa-search -g       # every project (your user settings)
```

Or straight from git — the built `dist/` is committed, because CodeWork installs git plugins with lifecycle scripts disabled:

```sh
codework plugin add 'git+https://github.com/prem315/codework-exa-search.git#main'
```

`plugin add` records the entry and installs it. On a fresh checkout that already declares it, run `codework plugin install`.

## Configuration

Configure it with a second entry that names the plugin, next to the one that loads it:

```jsonc
// .codework/settings.jsonc or ~/.codework/settings.jsonc
{
  "plugins": [
    "codework-exa-search",
    {
      "plugin": "exa.tool.search",
      "options": { "defaultNumResults": 5 }
    }
  ]
}
```

The configuration entry only sets options; it never loads anything. It can also address the plugin by the string that loaded it (`"package": "codework-exa-search"`), or turn it off in one project that inherits it from user settings (`"enabled": false`).

Prefer the `EXA_API_KEY` environment variable to `options.apiKey`, so the key stays out of a settings file you might commit.

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | `process.env.EXA_API_KEY` | Your Exa API key. |
| `defaultNumResults` | `number` | `5` | Default number of search results to return (clamped between 1 and 20). |

## Tool: `exa_search`

Searches the web via Exa AI.

### Parameters

- `query` (string, required): The search query to look up on the web.
- `numResults` (number, optional): Number of results to return (1-20).
- `type` (`"auto"` | `"fast"` | `"instant"` | `"deep"`, optional): `auto` (default) balances quality and speed, `fast`/`instant` trade depth for latency, `deep` is slower and more thorough.
- `includeDomains` (string[], optional): Restrict search to specific domains.
- `excludeDomains` (string[], optional): Exclude specific domains from search.

## Project Structure

This project follows modular TypeScript and Effect best practices:

- `src/constants.ts`: System defaults, limits, and endpoint constants.
- `src/schemas.ts`: Parameter, success, error and Exa response schemas, using `effect`.
- `src/config.ts`: Configuration parsing, environment resolution, and bounds clamping.
- `src/client.ts`: Exa AI HTTP client encapsulating requests, headers, and error handling.
- `src/format.ts`: Pure presentation functions to format search results for AI models.
- `src/tool.ts`: CodeWork tool definition and registration logic.
- `src/index.ts`: Plugin entry point and public exports.
