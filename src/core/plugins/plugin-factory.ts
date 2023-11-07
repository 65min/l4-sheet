import BasePlugin from './base-plugin.ts';
import {PluginType} from './plugin-type.enum.ts';
import ToolbarPlugin from './toolbar-plugin.ts';
import CanvasPlugin from './canvas-plugin.ts';
import TextBoxPlugin from './text-box.plugin.ts';
import ClickPlugin from './event/click.plugin.ts';
import DragPlugin from './event/drag.plugin.ts';
import MouseScrollbarPlugin from './event/mouse-scrollbar.plugin.ts';
import MouseHeaderPlugin from './event/mouse-header.plugin.ts';
import MouseContentPlugin from './event/mouse-content.plugin.ts';


export type PluginTypeMap = {
  // [key in PluginType]: BasePlugin;
  'Core': BasePlugin;
  'ToolBar': ToolbarPlugin;
  'Canvas': CanvasPlugin;
  'TextBox': TextBoxPlugin;
  'EventClick': ClickPlugin;
  'EventDrag': DragPlugin;
  'EventMouseScrollbar': MouseScrollbarPlugin;
  'EventMouseHeader': MouseHeaderPlugin;
  'EventMouseContent': MouseContentPlugin;
};

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

  public get<T extends PluginType>(type: T): PluginTypeMap[T] {
    return this.plugins.find(item => item.type === type) as PluginTypeMap[T];
  }
}
