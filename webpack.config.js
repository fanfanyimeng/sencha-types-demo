module.exports = {
    //唯一入口文件
    entry: __dirname + "/src/index.ts",
    output: {
        //打包后的文件存放的地方
        path: __dirname + "/public",
        filename: "bundle.js"//打包后输出文件的文件名
    },
    devServer: {
        contentBase: __dirname + "/public",
        proxy:{
            '/swagger.doc':{
                target: "http://localhost:3000/",
                changeOrigin: true
            },
            '/eureka': {
                target: "http://localhost:3000/",
                changeOrigin: true
            }
        }
    },


    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};