const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = (app) => {
    app.use(
        createProxyMiddleware("/sockjs-node", {
            target: "ws://localhost:3000",
            ws: true
        })
    );
    app.use(
        createProxyMiddleware("/api/v2/ws", {
            target: "wss://exchange.wenbit.com",
            https: true,
            secure: false,
            ws: true,
            changeOrigin: true,
            headers: {
                "Host": 'exchange.wenbit.com',
                "Origin": 'https://exchange.wenbit.com',
                "Connection": "keep-alive"
            },
        })
    );
};
