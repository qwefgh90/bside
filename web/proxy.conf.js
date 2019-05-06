const PROXY_CONFIG = {
    "/api": {
        "target": "http://localhost:8080",
        "secure": false,
        "pathRewrite": {
            "^/api": ""
        }
    }
}


module.exports = PROXY_CONFIG;