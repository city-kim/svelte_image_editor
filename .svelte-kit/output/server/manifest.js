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
		client: {"start":"_app/immutable/entry/start.8e2b601e.js","app":"_app/immutable/entry/app.99851281.js","imports":["_app/immutable/entry/start.8e2b601e.js","_app/immutable/chunks/index.e52dd962.js","_app/immutable/chunks/singletons.3735a474.js","_app/immutable/chunks/index.07b3af02.js","_app/immutable/entry/app.99851281.js","_app/immutable/chunks/index.e52dd962.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
