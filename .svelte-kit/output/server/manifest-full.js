export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.36a55b29.js","app":"_app/immutable/entry/app.cde69e56.js","imports":["_app/immutable/entry/start.36a55b29.js","_app/immutable/chunks/index.e52dd962.js","_app/immutable/chunks/singletons.1114c2c4.js","_app/immutable/chunks/index.07b3af02.js","_app/immutable/entry/app.cde69e56.js","_app/immutable/chunks/index.e52dd962.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
