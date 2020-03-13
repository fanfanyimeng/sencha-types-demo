import NorthPanel from "./NorthPanel";
import { Main as SouthPanel } from './SouthPanel/Main';

const eastPanel: Ext.panel.PanelConfig = {
    collapsible: true,
    region: "east",
    split: true,
    title: 'East Panel',
    hidden: true,
    width: 150,
    xtype: "panel"
};



const space = (length: number) => {
    const charArray: string[] = [];
    let i: number;
    for (i = 0; i < length; i++) {
        charArray.push(" ");
    }
    return charArray.join("");
};

const getRemoveWhiteSpace = (oldValue: string): string => {
    oldValue = oldValue.split("\n").join(" ");
    var charArray: string[] = [];
    var converting: boolean = false;
    var convertChar: string = '';
    for (var i = 0, length = oldValue.length; i < length; i++) {
        var charValue: string = oldValue.charAt(i);
        if (converting && charValue === convertChar) {
            if (oldValue.charAt(i - 1) !== "\\") {
                converting = false;
                convertChar = '';
                charValue = "\\" + (charValue === "\'" ? "\"" : charValue);
            }
        } else {
            if (!converting && (charValue === "\"" || charValue === "\'")) {
                converting = true;
                convertChar = charValue;
                charValue = "\\\"";
            } else {
                if (!converting && (charValue === " " || charValue === "	")) {
                    charValue = "";
                }
            }
        }
        charArray.push(charValue);
    }
    return charArray.join("");
};

const removeZhuanyi = (oldValue: string) => {
    return oldValue.replace(/\\\\/g, "\\").replace(/\\\"/g, "\"");
}


const jsonPanel: Ext.panel.PanelConfig = {
    layout: "fit",
    title: 'JSON处理',
    xtype: 'panel',
    tbar: {
        items: [
            {
                text: '粘贴', xtype: "button", handler: (btn: Ext.button.Button) => {
                    const contaier = btn.up("panel") as Ext.container.Container;
                    const textarea = contaier.down("textarea") as Ext.form.field.TextArea;
                    var inputEl: Ext.dom.Element = textarea.inputEl as Ext.dom.Element;

                    if (inputEl != undefined) {
                        const inputElDom: HTMLInputElement = inputEl.dom as HTMLInputElement;
                        inputElDom.focus();
                        inputElDom.select();
                        document.execCommand("paste");
                    }
                }
            } as Ext.button.ButtonConfig,
            {
                text: '复制', xtype: "button", handler: (btn: Ext.button.Button) => {
                    const contaier = btn.up("panel") as Ext.container.Container;
                    const textarea = contaier.down("textarea") as Ext.form.field.TextArea;
                    const value = textarea.getValue();
                    if (value.length === 0) {
                        return;
                    }
                    var inputEl: Ext.dom.Element = textarea.inputEl as Ext.dom.Element;

                    if (inputEl != undefined) {
                        const inputElDom: HTMLInputElement = inputEl.dom as HTMLInputElement;
                        inputElDom.focus();
                        inputElDom.select();
                        document.execCommand("copy");
                    }
                }
            } as Ext.button.ButtonConfig,
            { xtype: "tbseparator" } as Ext.toolbar.SeparatorConfig,
            {
                xtype: "button", text: '格式化', handler: (btn: Ext.button.Button) => {
                    const contaier = btn.up("panel") as Ext.container.Container;
                    const textarea = contaier.down("textarea") as Ext.form.field.TextArea;
                    const oldValue = textarea.getValue();
                    const oldValueLen = oldValue.length;
                    const newValueArray: string[] = [];
                    let spaceCount: number = 0;
                    let quotationMarks: any = false;
                    for (var i = 0; i < oldValueLen; i++) {
                        var currentChar = oldValue.charAt(i);
                        if (quotationMarks && currentChar === quotationMarks) {
                            if (oldValue.charAt(i - 1) !== "\\") {
                                quotationMarks = false
                            }
                        } else {
                            if (!quotationMarks && (currentChar === "\"" || currentChar === "'")) {
                                quotationMarks = currentChar
                            } else {
                                if (!quotationMarks && (currentChar === " " || currentChar === "	")) {
                                    currentChar = ""
                                } else {
                                    if (!quotationMarks && currentChar === ":") {
                                        currentChar += " "
                                    } else {
                                        if (!quotationMarks && currentChar === ",") {
                                            currentChar += "\n" + space(spaceCount * 2)
                                        } else {
                                            if (!quotationMarks && (currentChar === "[" || currentChar === "{")) {
                                                spaceCount++;
                                                currentChar += "\n" + space(spaceCount * 2)
                                            } else {
                                                if (!quotationMarks && (currentChar === "]" || currentChar === "}")) {
                                                    spaceCount--;
                                                    currentChar = "\n" + space(spaceCount * 2) + currentChar
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        newValueArray.push(currentChar)
                    }
                    textarea.setValue(newValueArray.join(""))
                }
            } as Ext.button.ButtonConfig,
            { xtype: "tbseparator" } as Ext.toolbar.SeparatorConfig,
            {
                text: '删除空格',
                xtype: "button", handler: (btn: Ext.button.Button) => {
                    const contaier = btn.up("panel") as Ext.container.Container;
                    const textarea = contaier.down("textarea") as Ext.form.field.TextArea;
                    const oldValue = textarea.getValue();
                    const oldValueLen = oldValue.length;
                    const newValueArray: string[] = [];
                    let quotationMarks: any = false;
                    for (var i = 0; i < oldValueLen; i++) {
                        var currentChar = oldValue.charAt(i);
                        if (quotationMarks && currentChar === quotationMarks) {
                            if (oldValue.charAt(i - 1) !== "\\") {
                                quotationMarks = false
                            }
                        } else {
                            if (!quotationMarks && (currentChar === '"' || currentChar === "'")) {
                                quotationMarks = currentChar
                            } else {
                                if (!quotationMarks && (currentChar === " " || currentChar === "\n")) {
                                    currentChar = ""
                                }
                            }
                        }
                        newValueArray.push(currentChar);
                    }
                    textarea.setValue(newValueArray.join(""));
                }
            } as Ext.button.ButtonConfig,
            { xtype: "tbseparator" } as Ext.toolbar.SeparatorConfig,
            {
                xtype: "button", text: '删除空格并转义',
                handler: (btn: Ext.button.Button) => {
                    const contaier = btn.up("panel") as Ext.container.Container;
                    const textarea = contaier.down("textarea") as Ext.form.field.TextArea;
                    const newValue: string = getRemoveWhiteSpace(textarea.getValue());
                    textarea.setValue(newValue);
                }
            } as Ext.button.ButtonConfig,
            { xtype: "tbseparator" } as Ext.toolbar.SeparatorConfig,
            {
                text: '去除转义', xtype: "button", handler: (btn: Ext.button.Button) => {
                    const contaier = btn.up("panel") as Ext.container.Container;
                    const textarea = contaier.down("textarea") as Ext.form.field.TextArea;
                    const newValue: string = removeZhuanyi(textarea.getValue());
                    textarea.setValue(newValue);
                }
            } as Ext.button.ButtonConfig
        ]
    } as Ext.toolbar.ToolbarConfig,
    items: {
        xtype: "textarea",
        border: false,
        value: '{"name":"test"}'
    } as Ext.form.field.TextAreaConfig
};

const centerPanel: Ext.tab.PanelConfig = {
    activeTab: 0,
    items: [jsonPanel],
    region: "center",
    xtype: 'tabpanel'
};



const MainView: Ext.container.ViewportConfig = {
    xtype: "viewport",
    layout: "border",
    items: [
        NorthPanel, SouthPanel, centerPanel, eastPanel
    ]
}


export default MainView;