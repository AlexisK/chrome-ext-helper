module.exports = {
    build: {
        compress: true,
        devtool: 'eval'
    },
    runtime: {
        name: 'prod',
        storageVer: '1.0',
        api: {
            path: '/api/',
            maps: {
                key: 'AIzaSyCXR960OzXuSyw8qK7HMeMAUIjW0ssH1Hk'
            }
        }
    }
};
