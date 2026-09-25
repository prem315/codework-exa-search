import { Plugin, Tool } from "@codeworksh/plugin";
import { resolveConfig } from "./config.js";
import { createExaSearchTool } from "./tool.js";
export * from "./constants.js";
export * from "./schemas.js";
export * from "./config.js";
export * from "./format.js";
export * from "./client.js";
export * from "./tool.js";
export default Plugin.define({
    // `vendor.domain.context`. The `codework.` namespace is reserved for built-ins, and the harness
    // refuses to load a plugin that claims it.
    id: "exa.tool.search",
    kind: "tool",
    setup(ctx, options) {
        const config = resolveConfig(options);
        const tool = createExaSearchTool(config);
        ctx.plugin.tools.add(Tool.register(tool));
    },
});
//# sourceMappingURL=index.js.map