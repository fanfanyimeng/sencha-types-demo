const HtmlWebpackPlugin = require('html-webpack-plugin');
const publishPath = __dirname + "/build/publish/";
const buildJsName = "bundle.js";

module.exports = (env, argv) => {
    console.info("测试一下");
    console.info(JSON.stringify(argv));
    const envMode = argv.mode;
    var config = {
        //唯一入口文件
        entry: {
            index: __dirname + "/src/index.ts"
        },
        output: {
            //打包后的文件存放的地方
            path: publishPath,
            //打包后输出文件的文件名
            filename: buildJsName//打包后输出文件的文件名
        },
        devServer: {
            contentBase: __dirname + "/public",

        },
        devtool: envMode === "production" ? "cheap-module-source-map" : "source-map",
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
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: envMode === 'production' ? "JSON TOOL." : "JSON TOOL.(" + envMode + ")",
                template: __dirname + '/public/index.html',
                filename: publishPath + 'index.html',
                chunks: ['index'],
                inject: true,
                hash: true
            })
        ]
    };
    return config;
};