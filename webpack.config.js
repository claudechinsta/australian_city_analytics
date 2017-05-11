var webpack = require('webpack');

module.exports = {
    entry: [
        './main.js',
        'js/mapboxControl.js'
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};