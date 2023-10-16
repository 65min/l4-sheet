import PluginFactory from './plugins/plugin-factory.ts';
import ToolbarPlugin from './plugins/toolbar-plugin.ts';
import BasePlugin from './plugins/base-plugin.ts';
import {PluginType} from './plugins/plugin-type.enum.ts';
import CanvasPlugin from './plugins/canvas-plugin.ts';
import EventClickPlugin from './plugins/event-click-plugin.ts';
import state from './store/state.ts';
import EventDragPlugin from './plugins/event-drag-plugin.ts';
import EventMousePlugin from './plugins/event-mouse-plugin.ts';
import store from './store';


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
    this.pluginFactory.add(new EventClickPlugin(store.$canvas));
    this.pluginFactory.add(new EventDragPlugin(store.$canvas));
    this.pluginFactory.add(new EventMousePlugin(store.$canvas));
    // if ()
    // if (store.viewWidth < store.contentWidth) {
    // }

    // const showScroll = this.showScroll();
    // if (showScroll.h) {
    //   state.vScrollWidth = 16;
    //   state.viewWidth = state.viewWidth - 16;
    //   this.pluginFactory.add(new HScrollPlugin())
    // }
    // if (showScroll.v) {
    //   state.hScrollHeight = 16;
    //   state.viewHeight = state.viewHeight - 16;
    // }
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

}
