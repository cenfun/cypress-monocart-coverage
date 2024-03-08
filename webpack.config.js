module.exports = {

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-react'
                    ]
                }
            }
        }]
    }

};
