
import { SwaggerInfo, SwaggerPathInfo } from './model/SwarggerInfo'
import { MarkDown } from './MarkDown';
import { MainViewConfig } from './MainView';


function getDoc(swagger: SwaggerInfo, methodInfo: SwaggerPathInfo, responseRefType: string | undefined, responseSimpleType: string | undefined): string {

    let mdText = `**简要描述：**
-   ${methodInfo.summary}
-   ${methodInfo.description}
    
**编写者：** 
-   ${methodInfo.author}
    
**请求URL：** 
-  \`${methodInfo.path}\`
    
    
**请求方式：**
- ${methodInfo.method}
    
**返回数据的类型以及编码(Produces)**
- ${methodInfo.produces}
    
**参数：** 

${(methodInfo.parameters == null || methodInfo.parameters.length == 0) ?
            `无` :
            `|名称|描述|参数类别|传参方式|默认值   |是否必须   |
|:----    |:---|:----- |-----   |-----   |-----   |`
        }    
${MarkDown.getParameterForMD(methodInfo.parameters)}
    
**requestBody 参数说明：**
${MarkDown.getPrametersMDDoc(swagger, methodInfo.parameters)}
    
**返回示例**
${  responseSimpleType == undefined ? '' : responseSimpleType}
${  responseRefType == undefined ? '' : MarkDown.renderRefModel(swagger, responseRefType as string)}
`;

    return mdText;
}

var md = require('markdown-it')();

const ApiTreeView: Ext.tree.PanelConfig = {
    xtype: "treepanel",
    title: '项目服务列表',
    width: 500,
    store: {
        root: {
            expanded: true
        }
    } as Ext.data.TreeStoreConfig,
    rootVisible: false,
    split: true,
    region: "west",
    listeners: {
        itemclick(view: Ext.view.View, node: Ext.data.TreeModel | Ext.data.NodeInterface) {
            const methodNode = node as Ext.data.TreeModel;
            const nodeInterface = node as Ext.data.NodeInterface;
            const serviceNode = nodeInterface.parentNode as Ext.data.TreeModel;
            const swagger = serviceNode.get('swagger') as SwaggerInfo;
            const category = methodNode.get('category') as unknown as string;

            if (category !== "method") {
                return;
            }
            const methodInfo = methodNode.get('info') as SwaggerPathInfo;
            let responseRefType: string | undefined = undefined;
            let responseSimpleType: string | undefined = undefined;
            if (methodInfo.responses['200']) {
                if (methodInfo.responses['200'].schema) {
                    if (methodInfo.responses['200'].schema.type) {
                        responseSimpleType = methodInfo.responses['200'].schema.type
                    } else if (methodInfo.responses['200'].schema.$ref) {
                        responseRefType = methodInfo.responses['200'].schema.$ref;
                    }
                }
            }

            let me = this as unknown as Ext.tree.Panel;
            let mainView = me.up('[reference=apiContainer]') as unknown as MainViewConfig;
            let markDownDoc = getDoc(swagger, methodInfo, responseRefType, responseSimpleType);
            let requestHeader = '';

            if (methodInfo.method != "get") {
                requestHeader += '"Content-Type":"application/json"';
            }

            requestHeader += `
"Authorization":"Bearer [token_1]"
"jm":"[CaseStep.jm]"
"Msgid":288572`;
            requestHeader = requestHeader.trim();

            mainView.setDocData({
                markDownDoc: markDownDoc,
                htmlDoc: md.render(markDownDoc),
                requestArguments: MarkDown.getPrametersTest(swagger, methodInfo.parameters),
                requestMethod: methodInfo.method,
                requestHeader: requestHeader,
                url: methodInfo.path,
                requestResult: responseRefType ? MarkDown.renderTestResult(swagger, responseRefType as string) : ''
            })

        },
        boxready: (tree: Ext.tree.Panel) => {
            let root = tree.getRootNode() as Ext.data.NodeInterface;
            Ext.Ajax.request({
                url: '/eureka/tree'
            }).then(function (response: any, opts: any) {
                var obj = Ext.decode(response.responseText) as object[];
                obj.forEach((item) => {
                    root.appendChild(item);
                });

            },
                function (response: any, opts: any) {
                    console.log('server-side failure with status code ' + response.status);
                });
        },
        beforeitemexpand: function (node: Ext.data.TreeModel | Ext.data.NodeInterface, eOpts: any) {
            let me = this as Ext.tree.Panel;

            let model = node as Ext.data.TreeModel;
            if (model.get("loaded") as unknown as boolean === true) {
                return;
            }
            let nodeInterface = node as Ext.data.NodeInterface;
            const category = model.get('category') as unknown as string;
            if (category == 'service') {
                me.getEl().mask("正在加载数据");
                let url: string = "/swagger.doc?url=" + (model.get("nodeUrl") as unknown as string);
                Ext.Ajax.request({ url: url }).then(function (response: any, opts: any) {
                    let swagger = Ext.decode(response.responseText) as SwaggerInfo;
                    model.set('swagger', swagger);
                    model.set("loaded", true);

                    let childNodes = [];
                    for (const path in swagger.paths) {
                        const requestObj = swagger.paths[path];
                        for (const requestMethod in requestObj) {
                            const requestValue = requestObj[requestMethod] as SwaggerPathInfo;
                            requestValue.path = path;
                            requestValue.method = requestMethod;
                            childNodes.push({
                                leaf: true,
                                text: requestValue.path + '_' + requestMethod,
                                category: 'method',
                                info: requestValue
                            });
                        }
                    }

                    childNodes.sort((a, b) => {
                        if (a.text == b.text) {
                            return 0;
                        }
                        if (a.text < b.text) {
                            return -1;
                        }
                        return 1;
                    });

                    childNodes.forEach((child) => {
                        nodeInterface.appendChild(child);
                    });
                    me.getEl().unmask();

                },
                    function (response: any, opts: any) {
                        console.log('server-side failure with status code ' + response.status);
                    });
            }



        }
    }
}

export { ApiTreeView }