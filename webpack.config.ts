import webpack = require('webpack');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import merge = require('webpack-merge');

const configFn = (env: any, argv: any): webpack.Configuration[] => {
    const rootDir = __dirname;
    const publishPath = rootDir + "/build/publish/";
    const envMode = argv.mode;
    console.info("如果需要修改webpack配置，请修改webpack.config.ts,不要修改webpack.config.js");
    console.info("测试一下" + rootDir);
    console.info(JSON.stringify(argv));

    const pages: webpack.Configuration[] = [
        {
            entry: {
                index: rootDir + "/src/index.ts",
            },
            plugins: [
                new HtmlWebpackPlugin({
                    title: envMode === 'production' ? "JSON TOOL." : "JSON TOOL.(" + envMode + ")",
                    option:{
                        extTag:envMode === 'production' ? "" : "-debug"
                    },
                    template: rootDir + '/public/index.html',
                    filename: publishPath + 'index.html',
                    chunks: ['index'],
                    inject: true,
                    hash: true
                })
            ]
        },
        {
            entry: {
                shudu: rootDir + "/src/shudu/index.ts",
            },
            plugins: [
                new HtmlWebpackPlugin({
                    title: envMode === 'production' ? "数独." : "数独.(" + envMode + ")",
                    option:{
                        extTag:envMode === 'production' ? "" : "-debug"
                    },
                    template: rootDir + '/public/index.html',
                    filename: publishPath + 'shudu.html',
                    chunks: ['shudu'],
                    inject: true,
                    hash: true
                })
            ]
        },
        {
            entry: {
                pinyin: rootDir + "/src/pinyin/index.ts",
            },
            plugins: [
                new HtmlWebpackPlugin({
                    title: envMode === 'production' ? "拼音." : "拼音.(" + envMode + ")",
                    template: rootDir + '/public/pinyin.html',
                    filename: publishPath + 'pinyin.html',
                    chunks: ['pinyin'],
                    inject: true,
                    hash: true
                })
            ]
        }
    ];


    const config: webpack.Configuration = {
        output: {
            //打包后的文件存放的地方
            path: publishPath,
            //打包后输出文件的文件名
            filename: '[name].js'
        },
        devServer: {
            contentBase: rootDir + "/public"
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
        }
    };

    return pages.map(page => merge(config, page));
}
export default configFn;