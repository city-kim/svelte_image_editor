

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.84992caa.js","_app/immutable/chunks/index.e52dd962.js"];
export const stylesheets = ["_app/immutable/assets/0.9a03b62d.css"];
export const fonts = [];
