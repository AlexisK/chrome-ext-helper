module.exports = {
    build: {
        compress: true,
        devtool: 'eval'
    },
    runtime: {
        name: 'prod',
        api: '/api/',
        storageVer: '1.0'
    }
};
