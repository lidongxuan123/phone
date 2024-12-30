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
}
module.exports = proxy