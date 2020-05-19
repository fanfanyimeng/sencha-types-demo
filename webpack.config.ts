import webpack = require('webpack');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import merge = require('webpack-merge');



const definePage = (entry: string | string[] | webpack.Entry | webpack.EntryFunc,options?: HtmlWebpackPlugin.Options) => {
    return {
        entry: entry,
        plugins: [
            new HtmlWebpackPlugin(
                options
            )
        ]
    }
}

const configFn = (env: any, argv: any): webpack.Configuration[] => {
    const rootDir = __dirname;
    const publishPath = rootDir + "/build/publish/";
    const buildJsName = "bundle.js";
    const envMode = argv.mode;
    console.info("如果需要修改webpack配置，请修改webpack.config.ts,不要修改webpack.config.js");
    console.info("测试一下" + rootDir);
    console.info(JSON.stringify(argv));

    const pages = [  
        definePage({
            index: rootDir + "/src/index.ts"
        },{
            title: envMode === 'production' ? "JSON TOOL." : "JSON TOOL.(" + envMode + ")",
            template: rootDir + '/public/index.html',
            filename: publishPath + 'index.html',
            chunks: ['index'],
            inject: true,
            hash: true
        })
    ];

    
    const config: webpack.Configuration = {
        //唯一入口文件
        entry: {
            index: rootDir + "/src/index.ts"
        },
        output: {
            //打包后的文件存放的地方
            path: publishPath,
            //打包后输出文件的文件名
            filename: buildJsName//打包后输出文件的文件名
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


    return pages.map(page=>merge(config,page));
}
export default configFn;