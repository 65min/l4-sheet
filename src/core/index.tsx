import PluginFactory, {PluginTypeMap} from './plugins/plugin-factory.ts';
import ToolbarPlugin from './plugins/toolbar-plugin.ts';
import BasePlugin from './plugins/base-plugin.ts';
import {PluginType} from './plugins/plugin-type.enum.ts';
import CanvasPlugin from './plugins/canvas-plugin.ts';
import ClickPlugin from './plugins/event/click.plugin.ts';
import state from './store/state.ts';
import DragPlugin from './plugins/event/drag.plugin.ts';
import MouseScrollbarPlugin from './plugins/event/mouse-scrollbar.plugin.ts';
import store from './store';
import MouseHeaderPlugin from './plugins/event/mouse-header.plugin.ts';
import MouseContentPlugin from './plugins/event/mouse-content.plugin.ts';
import TextBoxPlugin from './plugins/text-box.plugin.ts';
import EventGlobalPlugin from './plugins/event/global.plugin.ts';

//
// // interface PluginTypeMap {
// //   ["a": HTMLAnchorElement;
// //   "abbr": HTMLElement;
// //   "address": HTMLElement;
// //   "area": HTMLAreaElement;
// //   "article": HTMLElement;
// //   "aside": HTMLElement;
// //   "audio": HTMLAudioElement;
// //   "b": HTMLElement;
// //   "base": HTMLBaseElement;
// //   "bdi": HTMLElement;
// //
// //   'TextBox': TextBoxPlugin;]
// // }
//
//
// // Core = 'Core',
// //   ToolBar = 'ToolBar',
// //   Canvas = 'Canvas',
// //   TextBox = 'TextBox',
// //   Event = 'Event',
// //   EventClick = 'EventClick',
// //   EventDrag = 'EventDrag',
// //   EventMouse = 'EventMouse',
// //   EventMouseScrollbar = 'EventMouseScrollbar',
// //   EventMouseHeader = 'EventMouseHeader',
// //   EventMouseContent = 'EventMouseContent',
// //
// //   SelectArea = 'SelectArea'
//
// type PluginTypeMap = {
//   // [key in PluginType]: BasePlugin;
//   'Core': BasePlugin;
//   'ToolBar': ToolbarPlugin;
//   'Canvas': CanvasPlugin;
//   'TextBox': TextBoxPlugin;
//   'EventClick': ClickPlugin;
//   'EventDrag': DragPlugin;
//   'EventMouseScrollbar': MouseScrollbarPlugin;
//   'EventMouseHeader': MouseHeaderPlugin;
//   'EventMouseContent': MouseContentPlugin;
// };

export default class Wrap extends BasePlugin {

  pluginFactory: PluginFactory;

  type = PluginType.Core;

  constructor(selector: string) {
    super(selector);
    this.pluginFactory = new PluginFactory();
  }

  init(): void {

    this.$target!.innerHTML = `
      <div class="l4__toolbar-wrap"></div>
      <div class="l4__content-wrap"></div>
    `;

    this.pluginFactory.add(new ToolbarPlugin('.l4__toolbar-wrap'));
    this.pluginFactory.add(new CanvasPlugin('.l4__content-wrap'));
    this.pluginFactory.add(new TextBoxPlugin('.l4'));
    this.pluginFactory.add(new ClickPlugin(store.$canvas));
    this.pluginFactory.add(new DragPlugin(store.$canvas));
    this.pluginFactory.add(new MouseScrollbarPlugin(store.$canvas));
    this.pluginFactory.add(new MouseHeaderPlugin(store.$canvas));
    this.pluginFactory.add(new MouseContentPlugin(store.$canvas));
    this.pluginFactory.add(new EventGlobalPlugin());

  }

  showScroll(): {h: boolean, v: boolean} {

    // @ts-ignore
    let {viewWidth, viewHeight, contentWidth, contentHeight, vScrollWidth, hScrollHeight} = state;

    const showHScroll = viewWidth < contentWidth;
    const showVScroll = viewHeight < contentHeight;

    if (!showHScroll && !showVScroll) {
      return {h: false, v: false};
    } else if (showHScroll && !showVScroll) {
      hScrollHeight = 16;
      viewHeight = viewHeight - 16;
      const showVScroll = viewHeight < contentHeight;
      return {h: showHScroll, v: showVScroll};
    } else if (!showHScroll && showVScroll) {
      hScrollHeight = 16;
      viewWidth = viewWidth - 16;
      const showHScroll = viewWidth < contentWidth;
      return {h: showHScroll, v: showVScroll};
    }

    return {h: true, v: true};
  }

  public getPlugin<T extends PluginType>(type: T): PluginTypeMap[T] {
    return this.pluginFactory.get(type);
  }

}
