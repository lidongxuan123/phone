const proxy = {
    '/api/': {
        // 要代理的地址
        target: 'https://q.stock.sohu.com/hisHq',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
    '/dapi/': {
        // 要代理的地址
        target: 'https://q.stock.sohu.com',
        changeOrigin: true,
        pathRewrite: { '^/dapi': '' },
    }

    // '/dapi/': {
    //     // 要代理的地址
    //     target: 'https://hqm.stock.sohu.com',
    //     changeOrigin: true,
    //     pathRewrite: { '^/dapi': '' },
    // },
    // '/getqjson': {
    //     // 要代理的地址
    //     target: 'https://hq.sinajs.cn',
    //     changeOrigin: true,
    //     pathRewrite: { '^/getqjson': '' },
    // },
}
module.exports = proxy