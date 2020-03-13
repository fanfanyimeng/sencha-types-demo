import { ApiTreeView } from './ApiTreeView';

interface MainViewData {
    markDownDoc: string;
    htmlDoc: string;
    url?: string,
    requestHeader?: string,
    requestMethod?: string,
    requestArguments?: string,
    requestResult?: string
}
interface MainViewConfig extends Ext.panel.PanelConfig {
    setDocData(data: MainViewData): void;
}
const MainView = {
    layout: "border",
    title: 'API管理',
    xtype: 'panel',
    reference: 'apiContainer',
    items: [
        ApiTreeView,
        {
            xtype: "tabpanel",
            region: "center",
            items: [
                {
                    xtype: "htmleditor", title: "ShowDoc文档", readOnly: true, reference: 'markdownDoc', iframeAttrTpl: 'style="font-size:50px !important;"', getDocMarkup: function () {

                        const padding: number = 3;
                        const height: number = 844;
                        return `<!DOCTYPE html><html><head><style type="text/css">
                        table {
                            color:#333333;
                            border-width: 1px;
                            border-color: #666666;
                            border-collapse: collapse;
                        }
                        table th {
                            border-width: 1px;
                            padding: 8px;
                            border-style: solid;
                            border-color: #666666;
                            background-color: #dedede;
                        }
                        table td {
                            border-width: 1px;
                            padding: 8px;
                            border-style: solid;
                            border-color: #666666;
                            background-color: #ffffff;
                        }
                        pre {
                            padding-left: 5px; background-color: rgb(252, 252, 252); border: 1px solid rgb(225, 225, 232);
                        }
                        pre code{
                            color:#080 !important;
                            font-size:16px !important;
                                font-family: "Microsoft YaHei", Helvetica, "Meiryo UI", "Malgun Gothic", "Segoe UI", "Trebuchet MS", Monaco, monospace, Tahoma, STXihei, 华文细黑, STHeiti, "Helvetica Neue", "Droid Sans", "wenquanyi micro hei", FreeSans, Arimo, Arial, SimSun, 宋体, Heiti, 黑体, sans-serif !important;
                        }
                            ${(Ext.isOpera || Ext.isIE ? 'p{margin:0;}' : '')}

                            body{
                                font-size:16px !important;
                                font-family: "Microsoft YaHei", Helvetica, "Meiryo UI", "Malgun Gothic", "Segoe UI", "Trebuchet MS", Monaco, monospace, Tahoma, STXihei, 华文细黑, STHeiti, "Helvetica Neue", "Droid Sans", "wenquanyi micro hei", FreeSans, Arimo, Arial, SimSun, 宋体, Heiti, 黑体, sans-serif !important;
                                border:0;margin:0;padding:${padding}px;direction:ltr;
                                ${(Ext.isIE8 ? Ext.emptyString : 'min-')}height:${height}px;
                                box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;cursor:text;background-color:white;
                            }
                        </style></head><body></body></html>`;

                    },
                } as Ext.form.field.HtmlEditorConfig,
                {
                    xtype: "panel",
                    title: "接口测试文档",
                    layout: 'form',
                    autoScroll: true,
                    anchor: '95%',
                    defaults: { readOnly: true },
                    items: [
                        { xtype: "textfield", fieldLabel: 'url', reference: 'testUrl' } as Ext.form.field.TextConfig,
                        { xtype: "textarea", fieldLabel: '请求头', reference: 'testHeader', grow: true } as Ext.form.field.TextAreaConfig,
                        { xtype: "textfield", fieldLabel: '方法', reference: 'testMethod' } as Ext.form.field.TextConfig,
                        { xtype: "textarea", fieldLabel: '入参', reference: 'testParameter', grow: true } as Ext.form.field.TextAreaConfig,
                        { xtype: "textarea", fieldLabel: '出参断言', reference: 'testResult', grow: true } as Ext.form.field.TextAreaConfig
                    ]
                } as Ext.panel.PanelConfig
            ]
        } as Ext.tab.PanelConfig
    ],
    setDocData(data: MainViewData) {
        let me = this as unknown as Ext.panel.Panel;

        //me.lookupReference('markdownDoc')为什么不能用    
        let markdownDoc = me.down('[reference=markdownDoc]') as Ext.form.field.Text;
        let testUrl = me.down('[reference=testUrl]') as Ext.form.field.Text;
        let testHeader = me.down('[reference=testHeader]') as Ext.form.field.TextArea;
        let testMethod = me.down('[reference=testMethod]') as Ext.form.field.Text;
        let testParameter = me.down('[reference=testParameter]') as Ext.form.field.TextArea;
        let testResult = me.down('[reference=testResult]') as Ext.form.field.TextArea;

        testUrl.setValue(data.url);
        testHeader.setValue(data.requestHeader);
        testMethod.setValue(data.requestMethod);
        testParameter.setValue(data.requestArguments);
        markdownDoc.setValue(data.htmlDoc);

        testResult.setValue(data.requestResult);
    }
} as MainViewConfig;


export { MainView, MainViewConfig };