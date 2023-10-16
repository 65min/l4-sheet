import BasePlugin from './base-plugin.ts';


export default class PluginFactory {

  private plugins: BasePlugin[];

  constructor() {
    this.plugins = [];
  }

  /**
   * 注册插件
   * @param plugins
   */
  public add(...plugins: BasePlugin[]) {
    if (plugins) {
      plugins.forEach(plugin => {
        const existPlugin = this.plugins.find(item => item.type === plugin.type);
        if (existPlugin) {
          throw new Error(`插件 ${plugin.type} 已注册`);
        }

        this.plugins.push(plugin);
        plugin.init();
      })
    }
  }

  public remove(plugin: BasePlugin) {
    const existPluginIndex = this.plugins.findIndex(item => item.type === plugin.type);
    if (existPluginIndex < 0) {
      throw new Error(`插件 ${plugin.type} 未注册`);
    }

    this.plugins[existPluginIndex].destroy();
    this.plugins.splice(existPluginIndex, 1);
  }
}
