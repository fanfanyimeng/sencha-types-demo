
const listenersConfig:Ext.panel.PanelEvent = {
  boxready:(obj: Ext.panel.Panel, width: number, height: number, eOpts: object)=>{
    obj.setHtml('<h1 class="x-panel-header">Hello Ts</h1>');
  }
}
const NorthPanel:Ext.panel.PanelConfig={
  border: false,
  margin: '0 0 5 0',
  hidden:true,
  region: "north",
  xtype:"panel",  
  listeners:listenersConfig
};
export default NorthPanel;