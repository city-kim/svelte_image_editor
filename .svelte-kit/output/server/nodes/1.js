

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.3fef9a16.js","_app/immutable/chunks/index.e52dd962.js","_app/immutable/chunks/singletons.3735a474.js","_app/immutable/chunks/index.07b3af02.js"];
export const stylesheets = [];
export const fonts = [];
