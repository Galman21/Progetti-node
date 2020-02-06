var HttpDispatcher = function () {
    this.listeners = { get: [], post: [] };
}

HttpDispatcher.prototype.on = function (method, url, cb) {
    this.listeners[method].push({
        cb: cb,
        url: url
    });
}

HttpDispatcher.prototype.onGet = function (url, cb) {
    this.on('get', url, cb);
}

HttpDispatcher.prototype.onPost = function (url, cb) {
    this.on('post', url, cb);
}